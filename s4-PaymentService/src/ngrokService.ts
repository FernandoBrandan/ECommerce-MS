const getNgrokUrl = async (): Promise<string | null> => {
    try {
        //const response = await fetch('http://localhost:4040/api/tunnels')
        const response = await fetch('http://ngrok:4040/api/tunnels')
        const data = await response.json() as { tunnels: Array<{ proto: string; public_url: string }> }
        console.log(data)
        const tunnel = data.tunnels?.find((t) => t.proto === 'https')
        return tunnel?.public_url || null
    } catch (error) {
        console.error('Error getting ngrok URL:', error)
        return null
    }
}

const createUrls = async () => {
    const ngrokUrl = await getNgrokUrl()
    if (!ngrokUrl) throw new Error('Ngrok URL not found')
    const notificationUrl: string = `${ngrokUrl}/api/payment/webhook`
    const successUrl: string = `${ngrokUrl}/api/payment/success`
    const failureUrl: string = `${ngrokUrl}/api/payment/failure`
    const pendingUrl: string = `${ngrokUrl}/api/payment/pending`
    return { notificationUrl, successUrl, failureUrl, pendingUrl }
}

export default createUrls