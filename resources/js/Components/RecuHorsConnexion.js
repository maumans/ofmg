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
                       <View style={{flex:2,flexDirection:"row",justifyContent:"between",marginTop:"10px"}} >
                           <View style={{flex:1,marginLeft:10}}>
                               <View style={{flexDirection:"row"}}>
                                   <Image src={logo} style={{width:200,height:"auto"}} alt=""/>
                               </View>
                           </View>
                       </View>
                       <View style={{flex:1,flexDirection: 'row',justifyContent: 'center',marginTop:5}}>
                           <Text>Reçu du paiement</Text>
                       </View>
                       <View style={{flex:2,flexDirection: 'row',justifyContent: 'around',paddingLeft:10,paddingRight:10}}>

                           <View style={{flex:1,flexDirection: 'column'}}>
                               <Text style={styles.pp}>Reçu N°:   {Date.now()}</Text>
                               <Text style={styles.pp}>Date: {auj}</Text>
                           </View>

                           <View style={{flex:1,flexDirection: 'column'}}>
                               <Text style={styles.pp}> <Text style={{textTransform:"capitalize"}}>{props.apprenant.prenom}</Text> <Text style={{textTransform:"uppercase"}}>{props.apprenant.nom}</Text></Text>

                               <Text style={styles.pp}>{props.apprenant.classe.libelle}</Text>

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

function Save({apprenant,total}) {


    return (

       <Fragment>
           {

                <PDFViewer height={600} className={"flex w-full justify-center"}>
                    <MyDocument apprenant={apprenant} total={total}/>
                </PDFViewer>
            }

           <PDFDownloadLink  document={<MyDocument apprenant={apprenant} total={total} />} fileName={"reçu.pdf"}>
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
