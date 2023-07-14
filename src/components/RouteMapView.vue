<script setup>
import { ref } from 'vue';
import FairCalculatorService from '../services/FairCalculatorService';

const props = defineProps({
    routeDirections: [],
    courierDetails: {
        pickupAvenvue: null,
        dropAvenvue: null,
        pickupStreet: null,
        dropStreet: null,
        pickupBlock: null,
        dropBlock: null,
        deliveryCost: null,
        customerDetails: null,
    },
});



function checkAdjacentExistence(subRoute, totalDirections) {
    const subRouteSet = new Set(subRoute);
    const totalDirectionsString = totalDirections.join(',');

    for (let i = 0; i < totalDirections.length - 1; i++) {
        const r1 = totalDirections[i] + ',' + totalDirections[i + 1];
        const r2 = totalDirections[i + 1] + ',' + totalDirections[i];
        if (subRouteSet.has(totalDirections[i]) && subRouteSet.has(totalDirections[i + 1]) && (totalDirectionsString.includes(r1) || totalDirectionsString.includes(r2))) {
            return true;
        }
    }

    return false;
}

function isRouteActive(routes) {
    const isRoutePassed = checkAdjacentExistence(routes, props.routeDirections)
    return isRoutePassed ? isRoutePassed : false;
}

const geHorizontalDirection = (block) => {
    switch (block?.id?.charAt(1)) {
        case '1': return '<----';
        case '2': return '<--->';
        case '3': return '<----';
        case '4': return '---->';
        case '5': return '<----';
        case '6': return '<--->';
    }
}

const geVerticalDirection = (block) => {
    switch (block?.id?.charAt(3)) {
        case '1': return '<----';
        case '2': return '---->';
        case '3': return '<----';
        case '4': return '<--->';
        case '5': return '<----';
        case '6': return '---->';
    }
}

const isPickupBlock = (block) => {
    return block.label == props.courierDetails.pickupBlock;
}

const isDropBlock = (block) => {
    return block.label == props.courierDetails.dropBlock;
}

const streets = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
</script>
<template>
    <div class="mapContainer">
        <div class="mapSubContainer">
            <div v-for="block in FairCalculatorService.BLOCKS" :key="block.id" class="block"
                :class="{ pickupBlock: isPickupBlock(block), dropBlock: isDropBlock(block) }">
                <div class="route route-top" :class="{ activeRoute: isRouteActive(block.topRoutes) }">
                    <template v-if="block.id.charAt(3) == 2">{{ `${block.id.charAt(1)} Ave` }}</template>
                    <template v-if="block.id.charAt(3) == 1 || block.id.charAt(3) == 6">{{
                        geHorizontalDirection(block)
                    }}</template>
                </div>
                <div class="route route-bottom" :class="{ activeRoute: isRouteActive(block.bottomRoutes) }">
                    <template v-if="block.id.charAt(3) == 2 && block.id.charAt(1) == 6">{{ `7 Ave` }}</template>
                    <template v-if="(block.id.charAt(3) == 1 || block.id.charAt(3) == 6) && block.id.charAt(1) == 6">{{
                        '<----' }}</template>
                </div>
                <div class="route route-left vertical-text" :class="{ activeRoute: isRouteActive(block.leftRoutes) }">
                    <span v-if="block.id.charAt(1) == 2">{{ `${streets[block.id.charAt(3) - 1]}
                        Street` }}</span>
                    <span v-if="block.id.charAt(1) == 1 || block.id.charAt(1) == 6">{{
                        geVerticalDirection(block) }}</span>
                </div>
                <div class="route route-right vertical-text" :class="{ activeRoute: isRouteActive(block.rightRoutes) }">
                    <span v-if="block.id.charAt(1) == 2 && block.id.charAt(3) == 6">{{
                        `${streets[block.id.charAt(3)]}
                        Street` }}</span>
                    <span v-if="(block.id.charAt(1) == 1 || block.id.charAt(1) == 6) && block.id.charAt(3) == 6">{{
                        `<----` }}</span>
                </div>
                <div class="block-number">{{ block.label }}</div>
            </div>
        </div>
        <div class="colourDetailsWrapper">
            <v-row>
                <v-col>
                    <div class="colorDefine" v-bind:style="{ 'background-color': '#19ac2f' }"></div>
                </v-col>
                <v-col class="label">Pickup Block</v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div class="colorDefine" v-bind:style="{ 'background-color': '#ac1919' }"></div>
                </v-col>
                <v-col class="label">Drop Block</v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div v-bind:style="{ 'background-color': '#222222', 'width': '60px', 'height': '15px' }"></div>
                </v-col>
                <v-col class="label">Shortest Route</v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div v-bind:style="{ 'font-weight': '600', 'font-size': '25px' }">-----</div>
                </v-col>
                <v-col class="label">One way / Two Way</v-col>
            </v-row>
        </div>
    </div>
</template>
<style>
.mapContainer {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
}

.mapSubContainer {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 15px;
    width: 600px;
    height: 600px;
    position: relative;
}

.block {
    position: relative;
    background-color: #754fb6;
    color: rgb(255, 255, 255);
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pickupBlock {
    background-color: #19ac2f;
    transition: background-color 1s ease-in-out;
}

.dropBlock {
    background-color: #ac1919;
    transition: background-color 1s ease-in-out;
}

.route {
    position: absolute;
    background-color: rgb(206, 206, 206);
    color: #222222;
    text-align: center;
    transition: background-color 1s ease-in-out;
}

.activeRoute {
    color: white;
    background-color: #222222;
}

.route-top {
    top: -15px;
    left: 0;
    width: 100%;
    height: 15px;
}

.route-bottom {
    bottom: -15px;
    left: 0;
    width: 100%;
    height: 15px;
}

.route-left {
    top: 0;
    left: -15px;
    width: 15px;
    height: 100%;
}

.route-right {
    top: 0;
    right: -15px;
    width: 15px;
    height: 100%;
}

.block-number {
    z-index: 1;
}

.vertical-text {
    display: flex;
    align-items: center;
}

.vertical-text span {
    display: block;
    transform: rotate(180deg);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    white-space: nowrap;
}

.label {
    white-space: nowrap;
}

.colorDefine {
    width: 50px;
    height: 25px;
}
</style>