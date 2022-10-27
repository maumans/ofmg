<?php
namespace Crudfy\OmB2b\Interfaces;
interface IHasTransaction
{
    public function getTransactionIdAttribute();

    public function getOmNumberAttribute();

    public function getDepotNumberAttribute();

    public function getRetraitNumberAttribute();

    public function getAmountAttribute();

    public function getPosIdAttribute();

    public function getAddToTransactionAttribute();
}
