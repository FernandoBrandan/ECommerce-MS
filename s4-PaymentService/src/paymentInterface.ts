export interface IPayment {
    id?: string,
    payment_id?: string,
    status: string,
    preference_id: string,
    external_reference: string,
    init_point_url?: string,
    transaction_amount?: number,
    payment_method_id?: string,
    createdAt?: Date
    updatedAt?: Date
}


