import React, { Component } from 'react'
import Stage from './MissionPlanStage';
import cn from './MissionPlanStages.module.css';

export default class MissionPlanStages extends Component {

    renderArrow() {
        return (
            <div className={cn.Arrow}></div>
        )
    }

    render() {
        const {missionStages} = this.props;
        return (
            <div className={cn.MissionStagesWrapper}>
                {
                    missionStages.map((stage,i) => 
                                        <React.Fragment key={stage.stageId}>
                                            <Stage
                                                stageIndex={i}
                                                stage={stage} 
                                                isShowAddStageBtn={i === missionStages.length - 1}
                                            />
                                            {i !== missionStages.length - 1 ? this.renderArrow() : null}
                                        </React.Fragment>
                                        
                    )
                }                
            </div>
        )
    }
}
