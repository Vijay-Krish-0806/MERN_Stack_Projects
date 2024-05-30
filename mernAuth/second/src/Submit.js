import React from "react";
import { useQuery,gql } from "@apollo/client";
const MIS = gql`
query launchesPast($limit: Int!){
    launchesPast(limit: $limit) {
      launch_date_local
      mission_name
    }   
}`;
export default function Submit() {
  const { loading ,data, error } = useQuery(MIS,{variables: {limit: 5}});
  console.log(data)
  console.log(error)
  if(loading){
    return <h1>Loading..........................</h1>
  }
  if(error){
    return <p>{error.message}</p>
  }
  return (
    <div>
      <center>
        <h1>Hii</h1>
        <ul>
          {data.launchesPast.map((launch) => (
            <li key={launch.launch_date_local}>{launch.mission_name}</li>
          ))}
        </ul>
      </center>
    </div>
  );
}
