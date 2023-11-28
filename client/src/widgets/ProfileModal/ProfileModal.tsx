/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef, useState } from 'react'
import UserRequest from '../../requstTypes/UserRequest'
import { getCurrentUser } from '../../https/api/databaseApi'
import camera from '../../assets/camera.svg'
import checkMark from '../../widgets/AuthModals/assets/checkmark.svg'
import AuthService from '../../https/services/UserServices'
import './style.scss'

interface ProfileModalProps {
    setIsActiveModalProfile: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileModal: FC<ProfileModalProps> = ({ setIsActiveModalProfile }) => {
    const profileModalRef = useRef<HTMLDivElement | null>(null)
    const [currentUserData, setCurrentUserData] = useState<UserRequest | null>(
        null
    )
    const [newAvatarImage, setNewAvatarImage] = useState<string | null>(null)
    const [newUserName, setNewUserName] = useState<string | null>(null)
    const [isValidUserName, setIsValidUserName] = useState<boolean>(false)

    useEffect(() => {
        validateNewUserName()
    }, [newUserName])

    const handleUserNameInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewUserName(event.target.value)
    }

    const validateNewUserName = async () => {
        try {
            console.log(newUserName)
            if (newUserName && newUserName.length >= 5) {
                const responseDb =
                    await AuthService.validatePersonalInformationData(
                        newUserName
                    )
                if (responseDb) {
                    setIsValidUserName(false)
                } else {
                    setIsValidUserName(true)
                }
            } else {
                setIsValidUserName(false)
            }
        } catch (error) {
            console.error(
                'An error occurred while executing a database query:',
                error
            )
            setIsValidUserName(false)
        }
    }

    const handleSubmitChangeProfileData = async () => {
        try {
            if (newUserName && isValidUserName) {
                await AuthService.updateUserName(newUserName)
            }
            if (newAvatarImage && currentUserData?.avatar) {
                currentUserData.avatar = newAvatarImage
                await AuthService.updateUserAvatar(newAvatarImage)
            }
        } catch (error) {
            throw new Error('Error when trying update user data')
        }
    }

    const handleClickOutside = (e: React.MouseEvent) => {
        if (
            profileModalRef.current &&
            !profileModalRef.current.contains(e.target as Node)
        ) {
            setIsActiveModalProfile(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]

        if (selectedFile) {
            const reader = new FileReader()

            reader.onload = (event) => {
                const result = event.target?.result

                if (result) {
                    const base64String = result as string
                    setNewAvatarImage(base64String)
                    console.log(base64String)
                }
            }

            reader.readAsDataURL(selectedFile)
        }
    }

    useEffect(() => {
        const getCurrentUserData = async () => {
            const userData = await getCurrentUser()
            setCurrentUserData(userData)
        }

        getCurrentUserData()
    }, [])

    return (
        <div onClick={handleClickOutside} className="overlay-modal__profile">
            <div ref={profileModalRef} className="container-modal__profile">
            <button
                className="close-button__profile"
                onClick={() => setIsActiveModalProfile(false)}
            >
                &times;
            </button>
                <div className="container-user__data">
                    {currentUserData?.avatar && (
                        <>
                            <input
                                id="change-avatar"
                                className="file-input__avatar"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="change-avatar"
                                className="file-input-label"
                            >
                                <img
                                    className="user-avatar"
                                    src={
                                        newAvatarImage
                                            ? newAvatarImage
                                            : currentUserData?.avatar
                                    }
                                    alt="user avatar"
                                />
                                <div className="button-change__avatar">
                                    <img
                                        className="camera-icon"
                                        src={camera}
                                        alt="camera"
                                    />
                                    <p>Change</p>
                                </div>
                            </label>
                        </>
                    )}
                    <p className="user-name">{currentUserData?.userName}</p>
                </div>
                <div className="controllers-redactor__userData">
                    <input
                        placeholder="New name"
                        onChange={handleUserNameInputChange}
                        className="text-input__userName"
                        type="text"
                        about="userName"
                    />
                    {isValidUserName && (
                        <img
                            className="check-makr__userName"
                            src={checkMark}
                            alt="Check mark"
                        />
                    )}
                    <button
                        onClick={async () => {
                            await handleSubmitChangeProfileData()
                        }}
                        className="change-name__button"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal
