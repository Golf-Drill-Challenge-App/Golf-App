import React from 'react';
import drillData from "~/drill_data.json"
import ProfileCard from "~/components/profileCard";
import {Text} from "react-native";
import DrillCard from "~/components/drillCard";

function Index(props) {
    const user = drillData["users"]["1"];
    const drills = drillData["drills"];
    return (
        <>
            <ProfileCard user={user} />

            <Text>Drill History</Text>
            {Object.keys(drills).map((drillId) => {
                return (
                    <DrillCard drill={drills[drillId]} />
                );
            })}
        </>
    );
}

export default Index;