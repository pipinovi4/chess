import { FC } from 'react'
import './style.scss'
import EngineModel from '../../entites/EngineModel'

//constatnts height
const MIN_HEIGHT = 5;
const MAX_HEIGHT = 95;
const HEIGHT_ON_MATE = 100

interface PawnAdvantageColumnProps {
    engineModel: EngineModel
}

const PawnAdvantageColumn: FC<PawnAdvantageColumnProps> = ({
    engineModel
}) => {
    const pawnAdvantage = engineModel.getPawnAdvantage();
    const isMate = typeof pawnAdvantage === 'string'
    const scaleHeight = isMate ? HEIGHT_ON_MATE : 50 + pawnAdvantage * 5 

    const adjustedScaleHeight = isMate ? scaleHeight : Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, scaleHeight))

    return (
        <div className={'pawn-advantage__column'} data-content={isMate ? `M${pawnAdvantage}`: pawnAdvantage}>
            <div
                className="black-scale pawn-advantage__scale"
                style={{ height: `${100 - adjustedScaleHeight}%` }}
            ></div>
            <div
                className="white-scale pawn-advantage__scale"
                style={{ height: `${adjustedScaleHeight}%` }}
            ></div>
        </div>
    );
};

export default PawnAdvantageColumn;
