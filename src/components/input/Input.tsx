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
    onFocus,
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
    onFocus?: (e: any) => void,
    onBlur?: (e: any) => void,
    onKeyDown?: (e: any) => void,
    readOnly?: boolean,
    slots?: ReactNode
}) {
    return (
        <div className='w-full'>
            {label && <IonLabel position="stacked" className={`text-[#93b4d1] ${labelCss}`}>{label}</IonLabel>}
            <IonItem id={itemId} className={`border border-solid text-[#93b4d1] rounded-xl bg-white mb-2 ${inputCss}`} style={{ "--background": "transparent" }}>
                <IonInput
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onIonChange={onIonChange}
                    onFocus={onFocus}
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