import { defaultIcon, visitIcon, homeIcon, jobIcon, parkIcon } from "./ui.js";

const VISIT = "visit"
const HOME = "home"
const JOB = "job"
const PARK = "park"

const ZIYARET = "Ziyaret"
const EV = "ev"
const IS = "Is"
const PARK_YERI = "Park Yeri"
const TANIMSIZ = "Tanimsiz"


export const formatDate = (date) => {
    return new Date(date).toLocaleDateString("tr",{
        day: "2-digit",
        month: "long",
        year: "numeric"
    })
}


export const getStatus = (status) => {
    switch (status) {
        case VISIT:
            return ZIYARET
        case HOME:
            return EV;
        case JOB:
            return IS;
        case PARK:
            return PARK_YERI
        default:
            return TANIMSIZ;
    }
}

export const getNoteIcon = (status) =>{
    switch (status) {
        case VISIT:
            return visitIcon
        case HOME:
            return homeIcon;
        case JOB:
            return jobIcon;
        case PARK:
            return parkIcon
        default:
            return defaultIcon;
    }
}