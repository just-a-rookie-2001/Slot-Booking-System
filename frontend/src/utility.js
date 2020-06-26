import moment from "moment";

export const fromDecimal = (time, add = 0) => {
    const final = ((time + add) / 2 )+ 7.5
    const hours = Math.floor(final);
    const minutes = (final - hours) * 60;
    return moment().startOf('day').add(hours, 'hours').add(minutes, 'minute').format('HH:mm');
}

export const toDecimal = (time) => {
    const final = (time - 7.5) * 2;
    return final
}
