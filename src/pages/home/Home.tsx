import {
  IonPage,
  IonContent,
  IonButton,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
} from '@ionic/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { TbCopy } from "react-icons/tb";
import { GiCheckMark } from "react-icons/gi";
import { useHistory } from 'react-router';

import Input from '../../components/input/Input';
import { copyToClipboard, generateRandomCode } from '../../utility';

import FemaleImage from "../../assets/home/Female.jpg";
import MaleImage from "../../assets/home/Male.jpg";
import Header from '../../components/header';
import Investors from '../../components/common/Investors';

const Home: React.FC = () => {
  const history = useHistory();

  // Formik for handling form state and validation
  const formik = useFormik({
    initialValues: {
      secretCode: generateRandomCode(),
      fullName: '',
      gender: '',
    },
    validationSchema: Yup.object({
      secretCode: Yup.string()
        .required('Secret Code is required')
        .min(6, 'Secret Code must be at least 6 characters'),
      fullName: Yup.string()
        .required('Full Name is required')
        .matches(/^[A-Za-z ]*$/, 'Only letters are allowed'),
      gender: Yup.string().required('Please select a gender'),
    }),
    validateOnChange: true,
    onSubmit: (state) => {
      history.push({ pathname: '/chat', state })
    },
  });

  const copyText = () => copyToClipboard(formik.values.secretCode);

  return (
    <IonPage>
      <IonContent className="select-none flex flex-col h-full" style={{ backgroundColor: "#ffffff" }} fullscreen>
        <IonGrid className="w-full h-full flex justify-center">
          <IonRow className="w-full max-w-md px-5 flex flex-col h-full">
            <div className="h-[10%] flex items-end pb-2">
              <Header title="Omequa" />
            </div>

            {/* Form Section */}
            <IonCol className="flex-grow overflow-y-auto">
              <form onSubmit={formik.handleSubmit} className="h-full flex flex-col justify-evenly">
                <div>
                  {/* Secret Code Input */}
                  <Input
                    name="secretCode"
                    label="Secret Code"
                    placeholder="Enter Secret Code"
                    inputCss={`${formik.touched.secretCode && formik.errors.secretCode && 'border-red-500 border-2'}`}
                    value={formik.values.secretCode}
                    onIonChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    readOnly={true}
                    slots={(
                      <div slot="end" className='cursor-pointer'>
                        <TbCopy className="text-2xl text-[#93b4d1] hover:text-black hover:transition duration-300" onClick={copyText} />
                      </div>
                    )}
                  />

                  <IonText color="medium" className="text-sm mb-4 block">
                    Copy your secret code and enter for login if your cookie or cache is cleaned.
                  </IonText>
                </div>

                {/* Gender Selection */}
                <IonRow className="justify-center mb-4 gap-5">
                  {['Male', 'Female'].map((gender, index) => (
                    <IonCol key={index} size="5.5">
                      <IonCard
                        className={`relative shadow-none flex flex-col items-center p-4 border text-[#61b5ff] rounded-xl cursor-pointer bg-[#f1f8ff] ${formik.touched.gender && formik.errors.gender && 'border-red-500 border-2'} ${formik.values.gender === gender ? "border-[#61b5ff] border-3" : "border-[#93b4d1]"}`}
                        onClick={() => formik.setFieldValue("gender", gender)}
                      >
                        <img src={gender === "Male" ? MaleImage : FemaleImage} alt={gender} className="w-16 h-16 mb-2" />
                        <IonText className='font-semibold'>{gender}</IonText>

                        {formik.values.gender === gender && <GiCheckMark className="absolute top-2 right-2 text-lg" />}
                      </IonCard>
                    </IonCol>
                  ))}
                </IonRow>

                {/* Full Name Input */}
                <Input
                  name="fullName"
                  label="Full Name"
                  placeholder="Enter your name"
                  inputCss={`${formik.touched.fullName && formik.errors.fullName && 'border-red-500 border-2'}`}
                  value={formik.values.fullName}
                  onIonChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyDown={(e) => {
                    formik.handleChange(e);
                    e.keyCode === 13 && formik.handleSubmit()
                  }}
                />

                {/* Investor Section */}
                <Investors />
              </form>
            </IonCol>

            {/* Bottom Section */}
            <div className="h-[15%] flex flex-col justify-start pt-2">
              <div className='w-full text-center mb-2'>
                <span className="text-[#a943a0] text-sm bg-[#f2e3f1] p-1 rounded-md">245 Online Users</span>
              </div>
              <IonButton expand="full" fill="clear" size="large" className='rounded-2xl bg-[#68b2ff] text-white text-lg' onClick={() => formik.handleSubmit()}>
                Start
              </IonButton>
            </div>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>

  );
};

export default Home;
