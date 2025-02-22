import { IonInput, IonItem, IonLabel } from '@ionic/react'
import { ReactNode } from 'react'

function Input({
    name,
    label,
    itemId = "",
    placeholder = "",
    value = "",
    labelCss = "",
    inputCss = "",
    onIonChange,
    onBlur,
    onKeyDown,
    readOnly = false,
    slots,
}: {
    name: string,
    label?: string,
    itemId?: string
    placeholder?: string
    value: string
    labelCss?: string
    inputCss?: string
    onIonChange: (e: any) => void,
    onBlur?: (e: any) => void,
    onKeyDown?: (e: any) => void,
    readOnly?: boolean,
    slots?: ReactNode
}) {
    return (
        <div className='w-full'>
            {label && <IonLabel position="stacked" className={`text-[#93b4d1] ${labelCss}`}>{label}</IonLabel>}
            <IonItem id={itemId} className={`border text-[#93b4d1] rounded-xl bg-gray-100 mb-2 ${inputCss}`}>
                <IonInput
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onIonChange={onIonChange}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    readonly={readOnly}
                />
                {slots}
            </IonItem>
        </div>
    )
}

export default Input