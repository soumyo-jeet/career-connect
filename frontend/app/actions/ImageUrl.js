const generateImgUrl = async (file) => {
    console.log(file)
    try {
        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMG_API}`,
            {
                method: "POST",
                body: formData
            },
        )
        const json = await response.json()
        const url = json.data.medium.url
        console.log(url)
        return url
    } catch (err) {
        console.error("Upload failed:", err.response?.data || err.message)
        return null
    }
}


export default generateImgUrl