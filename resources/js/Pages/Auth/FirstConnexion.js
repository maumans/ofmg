import React, { useEffect } from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, useForm } from '@inertiajs/inertia-react';
import Authenticated from "@/Layouts/Authenticated";

export default function firstConnexion({email,auth,mois }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email,
        password: '',
        password_confirmation: '',
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('firstConnexion.reset'),);
    };

    return (
        <Authenticated
            auth={auth}
            errors={errors}
        >
            <Guest>
                <Head title="Première connexion" />

                <ValidationErrors errors={errors} />


                <div className={"space-y-2 py-3"}>
                    {
                        mois &&
                        <div className={"text-red-600"}>
                            Votre mot de passe a expiré
                        </div>
                    }
                    <div>
                        Changez votre mot passe avant de vous connecter
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div>
                        <Label forInput="email" value="Email" />

                        <Input
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            handleChange={onHandleChange}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <Label forInput="password" value="Nouveau mot de passe" />

                        <Input
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            isFocused={true}
                            handleChange={onHandleChange}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <Label forInput="password_confirmation" value="Confirmer le mot de passe" />

                        <Input
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            handleChange={onHandleChange}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Button className="ml-4" processing={processing}>
                            Reinitialisé le mot de passe
                        </Button>
                    </div>
                </form>
            </Guest>
        </Authenticated>

    );
}
