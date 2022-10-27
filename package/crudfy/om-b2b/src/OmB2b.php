<?php

namespace Crudfy\OmB2b;

use App\Models\Transaction;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class OmB2b
{
    private $baseUrl = 'https://api.orange.com/orange-money-b2b/v1/sx';

    private function url($url) {
        return $this->baseUrl.'/'.$url;
    }

    public function recursiveCollect(array $array) {
        if (!is_array($array)) {
            abort(421, $array);
        }
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $value = $this->recursiveCollect($value);
                $array[$key] = $value;
            }
        }

        return collect($array);
    }

    public function config($name = null, $defaulValue = null) {
        $key = $name ? "om-b2b.$name" : "om-b2b";
        $value = config($key);
        if ($value === null) {
            $value = $defaulValue;
        }
        return $value;
    }

    public function configDB($name = null, $defaulValue = null) {
        $key = $name ? "om-b2b-db.$name" : "om-b2b-db";
        $value = config($key);
        if ($value === null) {
            $value = $defaulValue;
        }
        return $value;
    }

    public function writeConfig() {
        $args = func_get_args();
        $configData = $this->configDB();
        if (count($args) == 1) {
            $configData = array_merge($configData, $args[0]);
        }
        else if (count($args) === 2) {
            $configData[$args[0]] = $args[1];
        }
        config()->set('om-b2b-db', $configData);

        $this->writeConfigFile($configData);
    }

    public function writeConfigFile($data) {
        $fileData = "<?php \nreturn [\n";
        foreach ($data as $key => $value) {
            $fileData .= "\t'$key' => ".'"'.$value.'",'."\n";
        }
        $fileData .='];';
       file_put_contents(__DIR__."/../config/om-b2b-db.php", $fileData);
    }

    public function auth() {
        $request = Http::withHeaders([
            'Authorization' => $this->config('authorization_header')
        ])->asForm()->post("https://api.orange.com/oauth/v3/token", [
            'grant_type' => 'client_credentials'
        ]);
        $data = collect(json_decode($request->body(), true));
        $expire_in = $data->get('expires_in');
        $auth_token_expire_in = now()->addSeconds($expire_in)->subMinute(5)->timestamp;
        $token = $data->get('token_type').' '.$data->get('access_token');
        $this->writeConfig([
            "auth_token" => $token,
            "auth_token_expire_in" => $auth_token_expire_in
        ]);
        return $token;
    }

    public function getAuthToken() {
        $config = collect($this->configDB());
        $token = null;
        if (
            $config->get('auth_token') &&
            $config->get('auth_token_expire_in') &&
            now()->timestamp < $config->get('auth_token_expire_in')
        ) {
            $token = $config->get('auth_token');
        }
        else {
            $token = $this->auth();
        }
        return $token;
    }

    public function serviceToken() {
        $request = Http::withHeaders([
            'Authorization' => $this->getAuthToken(),
            'Content-Type' => 'application/json'
        ])->get($this->url('services'));
        $data = $this->recursiveCollect(json_decode($request->body(), true));
        $serviceToken = $data->get('token')->get('value');
        $expire_in = $data->get('token')->get('expiresIn');
        $service_token_expire_in = now()->addSeconds($expire_in)->subSecond(30)->timestamp;
        $services =  $data->get('services')->get(0)->get('items')->map(function ($item) {
            return $item->get('name');
        })->join(',');

        $this->writeConfig([
            'service_token' => $serviceToken,
            'services' => $services,
            'service_token_expire_in' => $service_token_expire_in
        ]);
        return $serviceToken;
    }

    public function getServiceToken() {
        $config = collect($this->configDB());
        $token = null;
        if (
            $config->get('service_token') &&
            $config->get('service_token_expire_in') &&
            now()->timestamp < $config->get('service_token_expire_in')
        ) {
            $token = $config->get('service_token');
        }
        else {
            $token = $this->serviceToken();
        }
        return $token;
    }

    public function formToken($service) {
        $request = Http::withHeaders([
            'Authorization' => $this->getAuthToken(),
            'x-omr-services-token' => $this->getServiceToken(),
            'Content-Type' => 'application/json',
            'service' => $service
        ])->get($this->url("forms/$service"));
        $data = $this->recursiveCollect(json_decode($request->body(), true));
        $version = $data->get('version');
        $endpoint = $data->get('endpoint');
        $form_token = $data->get('token')->get('value');
        $form_token_expire_in = now()->addSeconds($data->get('token')->get('expiresIn'))->subMinute(5)->timestamp;
        $amount = $data->get('form')->where('name', 'amount')->first();
        $amount_minimum = $amount->get('minimum');
        $amount_maximum = $amount->get('maximum');
        $this->writeConfig([
            "{$service}_version" => $version,
            "{$service}_endpoint" => $endpoint,
            "{$service}_form_token" => $form_token,
            "{$service}_form_token_expire_in" => $form_token_expire_in,
            "{$service}_amount_maximum" => $amount_maximum,
            "{$service}_amount_minimum" => $amount_minimum,
        ]);

        return $form_token;
    }

    public function getFormToken($service) {
        $config = collect($this->configDB());
        $token = null;
        if (
            $config->get("{$service}_form_token") &&
            $config->get("{$service}_form_token_expire_in") &&
            now()->timestamp < $config->get("{$service}_form_token_expire_in")
        ) {
            $token = $config->get("{$service}_form_token");
        }
        else {
            $token = $this->formToken($service);
        }
        return $token;
    }

    public function makeTransaction($service, $props) {
        $body = [
            "peerIdType" => $this->config('peerIdType'),
            "currency" => $this->config('currency'),
            "posId" =>$props['posId'],
            "peerId" => $props['peerId'],
            "transactionId" => $props['transactionId'],
            "amount" => $props['amount'],
        ];
        $request = Http::withHeaders([
            'Authorization' => $this->getAuthToken(),
            'x-omr-forms-token' => $this->getFormToken($service),
            'Content-Type' => 'application/json',
            'service' => $service,
            'x-omr-forms-version' => $this->configDB("{$service}_version")
        ])->post($this->url("transactions/$service"), $body);

        $status = $request->status();
        $data = json_decode($request->body(), true);
        return $data;
    }

    public function cashin($props, $data = []) {
        return $this->makeTransaction('cashin', $props);
    }

    public function cashout($props, $data = []) {
        return $this->makeTransaction('cashout', $props);
    }


    public function makeTransactionAndSave($service, $props, $operation) {
        $props['peerId'] = $props['number'];
        unset($props['number']);
        $data = ['item_model' => get_class($operation), 'item_key' => $operation->id];
        $transaction = Transaction::create(array_merge(
            $props,
            ['type' => mb_strtoupper($service)],
            $data
        ));
        $transactionData = $this->{$service}($props);
        $this->addOperationColumnToTransaction($transaction, $operation);
        $transactionResponse = $this->makeTransaction('cashin', $props);
        $_response = collect($transactionData);

        $operation->transaction_status = $_response->get('status');
        $operation->save();

        $transaction->update(array_merge(
            [
                'message' => $_response->get('message'),
                'status' => $_response->get('status')
            ],
            $_response['transactionData'],
        ));
        sleep(1);
        $getTransaction = "get".ucfirst($service);
        $resultatVerification = collect($this->{$getTransaction}($props['transactionId']));
        $transaction->update([
            'status' => $resultatVerification->get('status'),
            'message' => $resultatVerification->get('message'),
            'txnId' => $resultatVerification->get('transactionData')['txnId']
        ]);
        $operation->transaction_status = $resultatVerification->get('status');
        $operation->save();
        return $transaction;
    }

    public function cashinAndSave($props, $operation) {
        return $this->makeTransactionAndSave('cashin', $props, $operation);
    }

    public function cashoutAndSave($props, $operation) {
        return $this->makeTransactionAndSave('cashout', $props, $operation);
    }

    public function getTransaction($service, $tansactionId) {
        $request = Http::withHeaders([
            'Authorization' => $this->getAuthToken(),
            'Content-Type' => 'application/json',
            'service' => $service
        ])->get($this->url("transactions/{$tansactionId}"));
        $data = json_decode($request->body(), true);
        return $data;
    }

    public function getCashin($transactionId) {
        return $this->getTransaction('cashin', $transactionId);
    }

    public function getCashout($transactionId) {
        return $this->getTransaction('cashout', $transactionId);
    }

    public function canMakeTransaction($type, $operation) {
        $successTransaction = $operation->transactions->where('type', mb_strtoupper($type))
            ->where('status', 'SUCCESS')
            ->first();
        return $successTransaction ? false : true;
    }

    public function log($message, $type = 'debug', $channel = 'om-b2b') {
        $message = \Str::slug($message, ' ');
        \Log::channel($channel)->{$type}($message);
    }

    public function getTransactionsStatus() {
        return['PENDING', 'SUCCESS', 'FAILED'];
    }

    public function addOperationColumnToTransaction($transaction, $operation) {
        $column = $operation->operationColumn;
        if (!$column) {
            $table = $operation->getTable();
            $column = \Str::singular($table).'_id';
        }
        $columns  = Schema::getColumnListing($transaction->getTable());
        if ($column && in_array($column, $columns)) {
            $transaction->{$column} = $operation->id;
            $transaction->save();
        }
    }
}
