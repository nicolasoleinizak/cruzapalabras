import React from 'react'

class CrosswordsBoard extends React.Component{

    render(){
        let gridStyle = {
            gridTemplateColumns: `repeat(${this.props.matrix[0].length}, 1fr)`,
        }
        return(
            <div className="container p-1">
                <div className="cw-board" style={gridStyle}>
                { 
                this.props.matrix.map((row, rowIndex) => {
                    return row.map((cell, columnIndex) => {
                        let cellClassName = "filled-cw-cell"
                        if(cell.filling === " "){
                            cellClassName = "no-filled-cw-cell"
                        }
                        return(<div className={"cw-cell "+cellClassName} key={`cell${rowIndex}-${columnIndex}`}>
                            {
                            cell.number !== null &&
                                <div className="cw-number">{cell.number}</div>
                            }
                            <div className="cw-char">
                                {
                                    this.props.contentVisible? cell.filling : ""
                                }
                            </div>
                        </div>)
                    })
                    })
                }
                </div>
            </div>
            )
    }
}

export default CrosswordsBoard