import React, {Fragment, useEffect, useState} from 'react';
import ReactPDF, { PDFViewer } from '@react-pdf/renderer';
import {PDFDownloadLink, Page, Text, View, Document, StyleSheet,Image } from '@react-pdf/renderer';

import logo from "../img/logo.png"
import formatNumber from "@/Utils/formatNumber";
import {format} from "date-fns";


// Create styles

const styles = StyleSheet.create({


    pp:{
        fontSize:14,
        paddingVertical:2
    },

    col:{
        flex:1,
        border:"1px solid black",
        textAlign: "center"
    },
    col2:{
        width:50,
        flex:1,
        border:"1px solid black",
        textAlign: "center"
    },
    titre:{
        fontSize:16,
        paddingVertical:2,
        fontWeight:'bold',
        textDecoration: "underline",
    }

});

// Create Document Component
function MyDocument(props){

    const [frais,setFrais]=useState([])
    const [apprenants,setApprenants]=useState([])

    useEffect(()=>(

        props.paiements.map((paiement)=>{
            setFrais([...frais.filter((f)=>f.id!==paiement.type_paiement.id),paiement.type_paiement])
            setApprenants([...apprenants.filter((a)=>a.id!==paiement.apprenant.id),paiement.apprenant])
        })


    ),[])

    let auj=new Date().toLocaleDateString();
           return (
               <Document style={styles.page}>
                   <Page size={"A4"} orientation="portrait">
                       <View style={{flex:1,flexDirection:"row",marginHorizontal:10,justifyContent:'space-between',alignItems:'center'}}>
                           <View>
                               <Image src={logo} style={{width:150,height:"auto"}} alt=""/>
                           </View>

                           <View>
                               <Text style={{fontSize:15}} >{props.etablissement.nom}</Text>
                           </View>

                       </View>
                       <View style={{flex:1,flexDirection: 'row',justifyContent: 'center',marginTop:5}}>
                           <Text>Reçu de paiement</Text>
                       </View>
                       <View style={{flex:2,flexDirection: 'row',justifyContent: 'between',left:20}}>

                           <View style={{flex:1,flexDirection: 'column'}}>
                               <Text style={styles.pp}>Reçu N°:   {Date.now()}</Text>
                               <Text style={styles.pp}>Date: {format(new Date(props.date),"dd-MM-yyyy à HH:mm")}</Text>
                           </View>

                           <View style={{flex:1,flexDirection: 'column'}}>
                               <Text style={styles.pp}>Tuteur: <Text style={{textTransform:"capitalize"}}>{props.tuteur?.prenom}</Text> <Text style={{textTransform:"uppercase"}}>{props.tuteur.nom}</Text></Text>

                               <Text style={styles.pp}>Numero de paiement: {props.telephone}</Text>
                               <Text style={styles.pp}>ID Transaction: {props.transactionCurrentId}</Text>
                           </View>
                       </View>


                       <View style={{flex:3,flexDirection: 'column',marginHorizontal:10,marginTop:20}}>
                           <Text style={{
                               fontSize:16,
                               paddingVertical:10,
                               fontWeight: 'bold'
                           }}>
                               Liste des apprenants
                           </Text>
                           <View style={{flexDirection: 'row'}}>
                               <View style={styles.col}>
                                   <Text style={[styles.pp,{fontWeight:'bold'}]}>MATRICULE</Text>
                               </View>
                               <View style={styles.col}>
                                   <Text style={styles.pp}>NOM</Text>
                               </View>
                               <View style={styles.col}>
                                   <Text style={styles.pp}>PRENOM</Text>
                               </View>
                           </View>

                           {
                               apprenants?.map((apprenant) =>(
                                   <View key={apprenant.id} style={{flexDirection: 'row'}}>
                                       <View style={styles.col}>
                                           <Text style={styles.pp}>{apprenant.matricule}</Text>
                                       </View>
                                       <View style={styles.col}>
                                           <Text style={styles.pp}>{apprenant.nom}</Text>
                                       </View>
                                       <View style={styles.col}>
                                           <Text style={styles.pp}>{apprenant.prenom}</Text>
                                       </View>
                                   </View>
                               ))
                           }
                       </View>

                       <View style={{flex:3,flexDirection: 'column',marginHorizontal:10,marginTop:20,width:"300"}}>
                           <Text style={{
                               fontSize:16,
                               paddingVertical:10,
                               fontWeight: 'bold'
                           }}>
                               Liste des frais
                           </Text>
                           <View style={{flexDirection: 'row'}}>
                               <View style={styles.col2}>
                                   <Text style={[styles.pp,{fontWeight:'bold'}]}>N°</Text>
                               </View>
                               <View style={styles.col}>
                                   <Text style={styles.pp}>TYPE DE FRAIS</Text>
                               </View>
                           </View>

                           {
                               frais?.map((fraisSt) =>(
                                   <View key={fraisSt.id} style={{flexDirection: 'row'}}>
                                       <View style={styles.col2}>
                                           <Text style={styles.pp}>{fraisSt.id}</Text>
                                       </View>
                                       <View style={styles.col}>
                                           <Text style={styles.pp}>{fraisSt.libelle}</Text>
                                       </View>
                                   </View>
                               ))
                           }
                       </View>

                       <View style={{flex:1,flexDirection:"row",justifyContent:"end"}}>
                           <View style={{left:20}}>
                               <Text style={{padding:"5px",backgroundColor:"#ff7900",color:"white"}}>Total payé: {formatNumber(props.total)} FG</Text>
                           </View>
                       </View>
                   </Page>
               </Document>
           )
}

function Save({tuteur,etablissement,total,telephone,paiements,transactionCurrentId,date}) {

    return (

       <Fragment>
           {

                <PDFViewer height={600} className={"flex w-full justify-center"}>
                    <MyDocument tuteur={tuteur} etablissement={etablissement} telephone={telephone} total={total} paiements={paiements} transactionCurrentId={transactionCurrentId} date={date}/>
                </PDFViewer>
            }

           <PDFDownloadLink  document={<MyDocument tuteur={tuteur} etablissement={etablissement } telephone={telephone} total={total} paiements={paiements} transactionCurrentId={transactionCurrentId} date={date}/>} fileName={"reçu.pdf"}>
               {({blob,url,loading, error})=>(loading?"loading": <button className={"p-2 text-white orangeVertBackground rounded mt-5"}>Telecharger</button>)}
           </PDFDownloadLink>
       </Fragment>
)

}
export default Save;

const App = () => (

    <PDFViewer>
        <MyDocument />
    </PDFViewer>
);
