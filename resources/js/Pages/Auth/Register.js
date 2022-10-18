import React, { useEffect } from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Authenticated from "@/Layouts/Authenticated";

export default function Register({auth}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        prenom: '',
        nom: '',
        email: '',
        login: '',
        password: '',
        password_confirmation: '',
        adresse: '',
        telephone: '',
        situation_matrimoniale:"",
        titre:"",
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <Authenticated
            auth={auth}
            errors={errors}
        >
            <Guest>
                <Head title="Register" />

                <ValidationErrors errors={errors} />

                <form onSubmit={submit} >
                    <div>
                        <Label forInput="prenom" value="Prenom" />

                        <Input
                            type="text"
                            name="prenom"
                            value={data.prenom}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            handleChange={onHandleChange}
                            required
                        />
                    </div>
                    <div>
                        <Label forInput="nom" value="Nom" />

                        <Input
                            type="text"
                            name="nom"
                            value={data.nom}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            handleChange={onHandleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label forInput="adresse" value="Adresse" />

                        <Input
                            type="text"
                            name="adresse"
                            value={data.adresse}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            handleChange={onHandleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label forInput="telephone" value="Telephone" />

                        <Input
                            type="text"
                            name="telephone"
                            value={data.telephone}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            handleChange={onHandleChange}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <Label forInput="email" value="Email" />

                        <Input
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="email"
                            handleChange={onHandleChange}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                        <div className={"mt-4"}>
                            <FormControl  className={"w-full"}>
                                <InputLabel id="demo-simple-select-standard-label">Situation Matrimoniale</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={data.situation_matrimoniale}
                                    onChange={(e)=>setData("situation_matrimoniale",e.target.value)}
                                >
                                    <MenuItem value={"Celibataire"}>Celibataire</MenuItem>
                                    <MenuItem value={"Marié"}>Marié(e)</MenuItem>
                                    <MenuItem value={"Divorcé"}>Divorcé(e)</MenuItem>
                                    <MenuItem value={"Concubin"}>Concubin(e)</MenuItem>
                                    <MenuItem value={"Veuf"}>Veuf(ve)</MenuItem>
                                </Select>
                            </FormControl>
                            <div className={"flex my-2 text-red-600"}>{errors?.situation_matrimoniale}</div>
                        </div>

                        <div>
                            <Label forInput="login" value="Identifiant" />

                            <Input
                                type="text"
                                name="login"
                                value={data.telephone}
                                className="mt-1 block w-full"
                                autoComplete="login"
                                handleChange={onHandleChange}
                                required
                            />
                        </div>

                        <div className={"mt-4"}>
                            <FormControl  className={"w-full"}>
                                <InputLabel id="demo-simple-select-standard-label">Titre</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={data.titre}
                                    onChange={(e)=>setData("titre",e.target.value)}
                                >
                                    <MenuItem value={"M"}>Monsieur</MenuItem>
                                    <MenuItem value={"Mme"}>Madame</MenuItem>
                                    <MenuItem value={"Mlle"}>Mademoiselle</MenuItem>
                                </Select>
                            </FormControl>
                            <div className={"flex my-2 text-red-600"}>{errors?.titre}</div>
                        </div>
                    </div>


                    <div className="mt-4">
                        <Label forInput="password" value="Password" />

                        <Input
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            handleChange={onHandleChange}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <Label forInput="password_confirmation" value="Confirm Password" />

                        <Input
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            handleChange={onHandleChange}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Link href={route('login')} className="underline text-sm text-gray-600 hover:text-gray-900">
                            Deja inscrit ?
                        </Link>

                        <Button className="ml-4" processing={processing}>
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </Guest>
        </Authenticated>
    );
}
