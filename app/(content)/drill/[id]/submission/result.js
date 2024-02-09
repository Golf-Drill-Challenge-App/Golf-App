import React from 'react';
import {
    ScrollView,
    Text,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import ScatterChart from 'react-native-scatter-chart';
import ShotAccordion from '~/components/shotAccordion';
import { numTrunc } from '~/Utility';

function Result(props) {
    const dots = props.submission.shots.map((value, index) => (
        [value['sideLanding'], value['carryDiff']]
    ));
    const { width } = useWindowDimensions();

    return (
        <>
            <Appbar.Header statusBarHeight={0}>
                <Appbar.BackAction onPress={() => { }} color={"#F24E1E"} />
                <Appbar.Content title="20 Shot Challenge" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.sectionTitle}>Results</Text>

                <View style={styles.dataSection}>
                    <Text style={styles.dataTitle}>Strokes Gained</Text>
                    <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>Total</Text>
                        <Text style={styles.dataValue}>{numTrunc(props.submission['strokesGained'])}</Text>
                    </View>
                    <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>Average</Text>
                        <Text style={styles.dataValue}>
                            {numTrunc(props.submission['strokesGainedAverage'])}
                        </Text>
                    </View>
                </View>

                <View style={styles.dataSection}>
                    <Text style={styles.dataTitle}>Average Differences</Text>
                    <View style={styles.dataRow}>
                        <Text style={styles.dataValue}>
                            {numTrunc(props.submission['carryDiffAverage'])}
                        </Text>
                    </View>
                    <View style={styles.dataRow}>
                        <Text style={styles.dataValue}>
                            {numTrunc(props.submission['sideLandingAverage'])}
                        </Text>
                    </View>
                    <View style={styles.dataRow}>
                        <Text style={styles.dataValue}>
                            {numTrunc(props.submission['proxHoleAverage'])}
                        </Text>
                    </View>
                </View>

                <View style={styles.chartSection}>
                    <Text style={{ ...styles.sectionTitle, marginBottom: 15 }}>Shot Tendency</Text>
                    <View style={{ ...styles.chartContainer, width: width * 0.8 }}>
                        <ScatterChart
                            style={styles.chart}
                            backgroundColor='#ffffff'
                            data={[
                                {
                                    color: 'blue',
                                    unit: '%',
                                    values: dots,
                                },
                            ]}
                            horizontalLinesAt={[0]}
                            verticalLinesAt={[0]}
                            minY={-10}
                            maxY={10}
                            minX={-35}
                            maxX={35}
                            chartWidth={width * 0.8}
                        />
                    </View>
                </View>

                <ScrollView>
                    {props.submission['shots'].map(
                        (shot) =>
                        <ShotAccordion
                        key={shot['sid']}
                        shot={shot}
                        total={numTrunc(props.submission['shots'].length)}
                    />
                    )}
                </ScrollView>

            </ScrollView>
            <Button style={styles.restartButton} mode="contained" buttonColor="#F24E1E" textColor="white">Restart Drill</Button>
        </>
    );
}

export default Result;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dataSection: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f5f5f5', // Adjust as needed
        borderRadius: 10, // Or any desired value
    },

    dataTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },

    dataLabel: {
        fontSize: 14,
    },

    dataValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    chartSection: {
        marginBottom: 30,
        alignItems: 'center'
    },
    chartContainer: {
        
    },
    chart: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignSelf: 'center',
        height: 350
    },

    restartButton: {
        margin: 10,
        alignItems: 'center',
    },
});