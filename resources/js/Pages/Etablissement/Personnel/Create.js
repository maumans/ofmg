import React from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import {useForm} from "@inertiajs/inertia-react";
import NumberFormat from "react-number-format";


const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumberFormat
            isAllowed={(values) => {
                const {floatValue} = values;
                return ((floatValue >= 0 &&  floatValue <= props.max) || floatValue === undefined);
            }}
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator={true}

            isNumericString
            suffix={props.devise==="eur"?" €":props.devise==="usd"?" $":" FG"+"/"+props.frequence}
        />
    );
});


function Create({auth,error,fonctions}) {

    const {data,setData,post}=useForm({
        "prenom":"",
        "nom":"",
        "adresse":"",
        "telephone":"",
        /*"frequence":"",
        "fonction":"",
        "montant":""
         */
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    function handleSubmit(e)
    {
        e.preventDefault();

        post(route("etablissement.personnel.store",auth.user.id), {data:data})
    }


    return (
       <AdminPanel auth={auth} error={error} active={"personnel"} sousActive={"creerPersonnel"}>
           <div className={"m-5"}>
               <div className="text-xl my-5 font-bold">
                   Creation du personnel
               </div>
                <div>
                    <form onSubmit={handleSubmit} className={"gap-5 grid md:grid-cols-3 sm:grid-cols-2  grid-cols-1 items-end mb-5 border p-2"}>
                        <div>
                            <TextField className={"w-full"}  name={"prenom"} label={"Prenom"} value={data.prenom} onChange={onHandleChange}
                                       autoComplete="prenom"
                                       required
                            />
                        </div>
                        <div>
                            <TextField className={"w-full"}  name={"nom"} label={"Nom"} value={data.nom} onChange={onHandleChange}
                                       autoComplete="nom"
                                       required
                            />
                        </div>

                        <div>
                            <TextField className={"w-full"}  name={"adresse"} label={"Adresse"} value={data.adresse} onChange={onHandleChange}
                                       autoComplete="adresse"
                            />
                        </div>

                        <div>
                            <TextField className={"w-full"}  name={"telephone"} label={"Telephone"} value={data.telephone} onChange={onHandleChange}
                                       autoComplete="telephone"
                                       required
                            />
                        </div>

                        {
                            /*

                            <div>
                            <Autocomplete
                                onChange={(e,val)=>{
                                    setData("fonction",val)
                                }}
                                disablePortal={true}
                                options={fonctions}
                                getOptionLabel={(option)=>option.libelle}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Fonction"} label={params.libelle} required />}
                            />
                        </div>

                        <div>
                            <FormControl  className={"w-full"}>
                                <InputLabel>Frequence</InputLabel>
                                <Select
                                    name="frequence"
                                    value={data.frequence}
                                    onChange={onHandleChange}
                                    label="Frequence"
                                    required
                                >
                                    <MenuItem value={"MENSUELLE"}>Mensuelle</MenuItem>
                                    <MenuItem value={"HORAIRE"}>Horaire</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <TextField className={"w-full"}  name={"montant"} label={"Montant"} value={data.montant} onChange={onHandleChange}
                                       autoComplete="montant"
                                       InputProps={{
                                           inputComponent: NumberFormatCustom,
                                           inputProps:{
                                               max:10000000,
                                               "frequence":data.frequence==="MENSUELLE"?"mois":data.frequence==="HORAIRE"?"heure":"frequence"
                                           },
                                       }}
                                       required
                            />
                        </div>
                             */
                        }

                        <div className={'md:col-span-3 sm:col-span-2'}>
                            <button className={"p-3 text-white orangeVertBackground rounded"} type={"submit"}>
                                Enregistrer
                            </button>
                        </div>
                    </form>

                </div>
           </div>
       </AdminPanel>
    );
}

export default Create;
