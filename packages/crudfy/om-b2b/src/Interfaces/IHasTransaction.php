<?php
namespace Crudfy\OmB2b\Interfaces;
interface IHasTransaction
{
    public function getTransactionIdAttribute();

    public function getOmNumberAttribute();

    public function getAmountAttribute();

    public function getAddToTransactionAttribute();
}
