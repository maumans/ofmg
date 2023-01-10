import React, {Fragment, useEffect} from 'react';
import ReactPDF, { PDFViewer } from '@react-pdf/renderer';
import {PDFDownloadLink, Page, Text, View, Document, StyleSheet,Image } from '@react-pdf/renderer';

import logo from "../img/logo.png"
import formatNumber from "@/Utils/formatNumber";


// Create styles
const styles = StyleSheet.create({


   pp:{
      fontSize:12,
       paddingVertical:5
   },

});

// Create Document Component
function MyDocument(props){

    let auj=new Date().toLocaleDateString();
           return (
               <Document style={styles.page}>
                   <Page size={"A6"} orientation="landscape">
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
                               <Text style={styles.pp}>Date: {auj}</Text>
                           </View>

                           <View style={{flex:1,flexDirection: 'column'}}>
                               <Text style={styles.pp}>Tuteur: <Text style={{textTransform:"capitalize"}}>{props.tuteur?.prenom}</Text> <Text style={{textTransform:"uppercase"}}>{props.tuteur.nom}</Text></Text>

                               <Text style={styles.pp}>Numero de paiement: {props.telephone}</Text>
                           </View>
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

function Save({tuteur,etablissement,total,telephone}) {

    return (

       <Fragment>
           {

                <PDFViewer height={600} className={"flex w-full justify-center"}>
                    <MyDocument tuteur={tuteur} etablissement={etablissement} telephone={telephone} total={total}/>
                </PDFViewer>
            }

           <PDFDownloadLink  document={<MyDocument tuteur={tuteur} etablissement={etablissement } telephone={telephone} total={total}/>} fileName={"reçu.pdf"}>
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
