import axios from "axios";
import {Navigate} from "react-router-dom"

export default function signup () {
    
    const history = Navigate()

    const onSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8000/signup" , {

        })
        .catch((err) =>
        {
            console.log(err);
        })
        .then((res) => {
            //
            //
            history.push("/login")
        })
    }
    return (
    <div>
        <input type="text" onChange={onSubmit}/>
    </div>
    )
}