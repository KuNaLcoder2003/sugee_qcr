import React, { type ChangeEvent } from 'react'

interface InputProps {
    onChange? : ()=> void
    placeholder : string,
    styles? : string,
    value : string | number,
    type : "text" | "password" | "number"
}

const FormInput : React.FC<InputProps> = ({onChange , placeholder , value , type , styles}) => {
  return (
    <input type={type} placeholder={placeholder} onChange={(e)=>onChange} value={value} className={`${styles}`} />
  )
}

export default FormInput
