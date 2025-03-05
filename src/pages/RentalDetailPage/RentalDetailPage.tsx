import { useParams } from "react-router"

const RentalDetailPage = () => {

    const { id } = useParams()

    return (
        <div>{id}</div>
    )
}

export default RentalDetailPage