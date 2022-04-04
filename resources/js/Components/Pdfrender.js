import React, {Fragment, useEffect} from 'react';
import ReactPDF, { PDFViewer } from '@react-pdf/renderer';
import {PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


// Create styles
const styles = StyleSheet.create({
   th:{
       border:"1px solid black",
       padding:"5px",
       width:"23%",
       fontSize: 12

   },
    page:{
        width:300,
        height:300
    },
   br:{
       borderTopLeftRadius:"5px",
       borderTopRightRadius:"5px"
   },
   pp:{
      fontSize:15,
       paddingVertical:5
   },

   thead:{
      color:"white",
      backgroundColor:"black"
   }
});

// Create Document Component
function MyDocument(props){




    let auj=new Date().toLocaleDateString();
           return (
               <Document style={styles.page}>
                   <Page style={styles.page}>
                       <View style={{flex:1,flexDirection:"row",justifyContent:"between",marginTop:"50px"}} >
                           <View style={{flex:1,marginLeft:20}}>
                               <View style={{flexDirection:"row"}}>
                                   <Text style={{padding:"5px",backgroundColor:"#ff7900",color:"white"}}>{props.etablissement.nom}</Text>
                               </View>
                           </View>

                            <View style={{flex:1,marginBottom:5 , right:20}}>
                                <Text style={styles.pp}>Nom: {props.apprenant.nom}</Text>
                                <Text style={styles.pp}>Prenom: {props.apprenant.prenom}</Text>
                                <Text style={styles.pp}>Adresse: {props.apprenant.adresse}</Text>
                                <Text style={styles.pp}>Telephone: {props.apprenant.telephoneTuteur}</Text>
                                <Text style={styles.pp}>Classe: {props.apprenant.niveau.description}</Text>
                                <Text style={[styles.pp,{marginTop:10, fontStyle:"italic"}]}>Total payé: {props.total} FG</Text>
                            </View>
                       </View>

                       <View style={{marginLeft:30,marginBottom:20}}>
                           <Text style={{fontWeight:"bold",marginBottom:5}}>Reçu N°: <Text style={{fontSize: 15}}> {Date.now()}</Text></Text>
                           <Text style={{fontWeight:"bold"}}>Date: <Text style={{fontSize: 15}}> {auj}</Text></Text>
                       </View>

                       <View style={{flex:1,alignItems:"center"}}>
                           <View style={{flexDirection:"row"}}>
                               <Text style={[styles.th,styles.thead]}>Type de frais</Text>
                               <Text style={[styles.th,styles.thead]}>Totale à payer</Text>
                               <Text style={[styles.th,styles.thead]}>Payé</Text>
                               <Text style={[styles.th,styles.thead]}>Reste à payer</Text>
                           </View>

                           {
                               props.apprenant.paiements &&
                               props.apprenant.paiements.map(paiement=>(
                                   <View style={{flexDirection:"row"}} key={paiement.id}>
                                       <Text style={styles.th}>{paiement.type_paiement.libelle}</Text>
                                       <Text style={styles.th}>{paiement.tarif.montant} FG</Text>
                                       <Text style={styles.th}>{paiement.tarif.montant-paiement.resteApayer} FG</Text>
                                       <Text style={styles.th}>{paiement.resteApayer}</Text>
                                   </View>
                               ))
                           }


                       </View>

                       <View style={{flex:1,flexDirection:"row",border: "1px solid black",padding:2}}>

                       </View>


                   </Page>
               </Document>
           )
}

function Save({apprenant,etablissement,nbrMois,total,paiements}) {


    return (

       <Fragment>
           {

                <PDFViewer height={600} className={"flex w-full justify-center"}>
                    <MyDocument apprenant={apprenant} etablissement={etablissement} nbrMois={nbrMois} total={total} paiements={paiements}/>
                </PDFViewer>
            }

           <PDFDownloadLink  document={<MyDocument apprenant={apprenant} etablissement={etablissement } nbrMois={nbrMois} total={total} paiements={paiements}/>} fileName={"reçu.pdf"}>
               {({blob,url,loading, error})=>(loading?"loading": <button className={"p-2 text-white bg-green-400 rounded mt-5"}>Telecharger</button>)}
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
