import {router, useLocalSearchParams} from "expo-router";
import {StatusBar} from 'expo-status-bar';
import {Button, ScrollView, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {BarChart, Grid, YAxis} from "react-native-svg-charts";
import {Path} from "react-native-svg";
import React, {useMemo, useRef, useState} from "react";
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import {clampNumber, formatDate, numTrunc} from "~/Utility";
import DropDownPicker from "react-native-dropdown-picker";

import drillData from "~/drill_data.json"
import ShotAccordion from "~/components/shotAccordion";
import BarChartScreen from "~/components/barChart";

export default function Stat() {
    const slug = useLocalSearchParams()["id"];
    return (
        <>
        <BarChartScreen
            drillData={drillData["users"]["1"]["history"][slug]}
            mainOutputAttempt={drillData["drills"][slug]["mainOutputAttempt"]}/>
        </>
    )
}