import React, {useRef, useState} from 'react';
import {SketchField, Tools} from 'react-sketch'
import {Button} from 'react-bootstrap'
import { useMediaQuery } from 'react-responsive'
import { saveAs } from 'file-saver'
import axios from 'axios'

const styles = {
    draw: {
        margin : '0 auto'
    },
    result: {
        color : 'green'
    }
}

const Draw = () => {

    const bigscreen = useMediaQuery({ minDeviceWidth: 1201 })
    const smallscreen = useMediaQuery({ maxDeviceWidth: 1200 })

    const[result, setResult] = useState(false)

    const sketchbig = useRef()
    const sketchsmall = useRef()

    const handleSubmitBig = () => {
        const canvas = sketchbig.current.toDataURL()
        //saveAs(canvas, 'digit.jpg')
        sendDataBig(canvas)
    }

    const handleSubmitSmall = () => {
        const canvas = sketchsmall.current.toDataURL()
        //saveAs(canvas, 'digit.jpg')
        sendDataSmall(canvas)
    }

    const handleResetBig = () =>{
        sketchbig.current.clear()
        sketchbig.current._backgroundColor('black')
        setResult(false)
    }

    const handleResetSmall = () =>{
        sketchsmall.current.clear()
        sketchsmall.current._backgroundColor('black')
        setResult(false)
    }

    const sendDataBig = (c) => {
        const headers = {
            'accept' : 'application/json'
        }
        const fd = new FormData()
        fd.append('image', c)

        axios.post('http://digit-recognizer-webapp.herokuapp.com/api/digits/', fd, {headers:headers})
        .then(res=>{
            getImageResult(res.data.id)
        })
        .catch(err=>console.log(err))
    }

    const sendDataSmall = (c) => {
        const headers = {
            'accept' : 'application/json'
        }
        const fd = new FormData()
        fd.append('image', c)

        axios.post('http://digit-recognizer-webapp.herokuapp.com/api/digits/', fd, {headers:headers})
        .then(res=>{
            getImageResult(res.data.id)
        })
        .catch(err=>console.log(err))
    }

    const getImageResult = (id) => {
        axios.get(`http://digit-recognizer-webapp.herokuapp.com/api/digits/${id}/`)
        .then(res=>{
            setResult(res.data.result) // here result in res.data.id is the result column of table Digit.
        })
    }

    return (

        <React.Fragment>

            {result && <h1 style = {styles.result}>Result is {result}</h1>}

            {bigscreen &&
            <SketchField
                ref = {sketchbig}
                width = "300px"
                height = '300px'
                style = {styles.draw}
                tool = {Tools.Pencil}
                backgroundColor = 'black'
                lineColor = 'white'
                imageFormat = 'jpg'
                linewidth = {30}
            />
            }

            {smallscreen &&
            <SketchField
                ref = {sketchsmall}
                width = "200px"
                height = '200px'
                style = {styles.draw}
                tool = {Tools.Pencil}
                backgroundColor = 'black'
                lineColor = 'white'
                imageFormat = 'jpg'
                linewidth = {30}
            />
            }

            {bigscreen &&
            <div className = "mt-3">
                <Button variant = "outline-primary" onClick = {handleSubmitBig} size = "lg">Classify</Button>
                <Button variant = "outline-secondary" onClick = {handleResetBig} className = "ml-3" size = "lg">Reset</Button>
            </div>
            }

            {smallscreen &&
            <div className = "mt-3">
                <Button variant = "outline-primary" onClick = {handleSubmitSmall} size = "lg">Classify</Button>
                <Button variant = "outline-secondary" onClick = {handleResetSmall} className = "ml-3" size = "lg">Reset</Button>
            </div>
            }

        </React.Fragment>

    )
}

export default Draw;