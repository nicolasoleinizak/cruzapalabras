import React from 'react'

class CrosswordsBoard extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        let gridStyle = {
            gridTemplateColumns: `repeat(${this.props.matrix[0].length}, 1fr)`,
           //gridTemplateRows: `repeat(${this.props.matrix.length}, 30px)`
        }
        console.log(this.props.matrix)
        return(
            <div className="container p-1">
                <div className="cw-board" style={gridStyle}>
                { 
                this.props.matrix.map((row, rowIndex) => {
                    return row.map((cell, columnIndex) => {
                        console.log(cell.number)
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
                                {cell.filling}
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