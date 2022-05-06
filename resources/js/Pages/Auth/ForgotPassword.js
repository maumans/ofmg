import React from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import ValidationErrors from '@/Components/ValidationErrors';
import {Head, Link, useForm} from '@inertiajs/inertia-react';
import Authenticated from "@/Layouts/Authenticated";
import Label from "@/Components/Label";
import Checkbox from "@/Components/Checkbox";

export default function ForgotPassword({ status,auth }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <Authenticated
            auth={auth}
            errors={errors}
        >
            <Guest>
                <Head title="Mot de passe oublié" />

                <div className="mb-4 text-sm text-gray-500 leading-normal">
                    Mot de passe oublié ? Pas de soucis. Veuillez nous indiquer votre adresse e-mail et nous vous enverrons un lien de réinitialisation du mot de passe.
                </div>

                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                <ValidationErrors errors={errors} />

                <form onSubmit={submit}>
                    <Input
                        type="text"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        isFocused={true}
                        handleChange={onHandleChange}
                    />

                    <div className="flex items-center justify-end mt-4">
                        <Button className="ml-4" processing={processing}>
                            Lien de réinitialisation du mot de passe
                        </Button>
                    </div>
                </form>
            </Guest>
        </Authenticated>

    );
}
