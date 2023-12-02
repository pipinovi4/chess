const reg = /^([A-Z]?)([a-h][1-8])(x?)([A-Z]?)([a-h][1-8])([=][A-Z])?([+])?$/

const str = 'Nc1xf3=Q+'

const mama = () => {
    let resultAlgebraicNotation = ''
    const matchResult = str.match(reg)
    if (matchResult) {
        if (matchResult[3] && !matchResult[1])
            resultAlgebraicNotation += matchResult[2][0]
        if (matchResult[3]) resultAlgebraicNotation += matchResult[3]

        resultAlgebraicNotation += matchResult[5]
        if (matchResult[6]) resultAlgebraicNotation += matchResult[6]
        if (matchResult[7]) resultAlgebraicNotation += matchResult[7]
        return resultAlgebraicNotation
    }
}

const papa = mama()

console.log(papa)
