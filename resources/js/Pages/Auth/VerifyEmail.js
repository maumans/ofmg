import React from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Authenticated from "@/Layouts/Authenticated";
import ValidationErrors from "@/Components/ValidationErrors";
import Label from "@/Components/Label";
import Input from "@/Components/Input";

export default function VerifyEmail({ status,auth,errors }) {
    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <Authenticated
            auth={auth}
            errors={errors}
        >
            <Guest>
                <Head title="Email Verification" />

                <div className="mb-4 text-sm text-gray-600">
                    Merci de vous être inscrit(e) ! Avant de commencer, veuillez vérifier votre adresse e-mail en cliquant sur le lien que nous venons de vous envoyer. Si vous n'avez pas reçu cet e-mail, nous vous en enverrons un nouveau avec plaisir.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        Un nouveau lien de vérification a été envoyé à l'adresse e-mail que vous avez indiquée lors de votre inscription.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mt-4 flex items-center justify-between">
                        <Button processing={processing}>Renvoyer l'e-mail de vérification</Button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="underline text-sm text-gray-600 hover:text-gray-900"
                        >
                            Déconnexion
                        </Link>
                    </div>
                </form>
            </Guest>
        </Authenticated>

    );
}
