'use client'

import { useState, useEffect, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import { UserIcon, HeartIcon, CameraIcon, ScaleIcon, ArrowsUpDownIcon, CalendarIcon, BeakerIcon } from '@heroicons/react/24/outline';

import {
    Description,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Field,
    Label,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Switch,
} from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'


const user = {
    name: 'Debbie Lewis',
    handle: 'deblewis',
    email: 'debbielewis@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=320&h=320&q=80',
}


export default function ProfileInfo() {
    const [availableToHire, setAvailableToHire] = useState(true)
    const [privateAccount, setPrivateAccount] = useState(false)
    const [allowCommenting, setAllowCommenting] = useState(true)
    const [allowMentions, setAllowMentions] = useState(true)

    const { data: session, update } = useSession();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        weight: '',
        height: '',
        gender: '',
        age: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                setFormData({
                    name: session.user.name || '',
                    email: session.user.email || '',
                    weight: session.user.profile.weight || '',
                    height: session.user.profile.height || '',
                    gender: session.user.profile.gender || '',
                    age: session.user.profile.age || '',
                });
                setPreviewUrl(session.user.profile.profileImageUrl || '');

            }
        };
        fetchData();
    }, [session]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let profileImageUrl = session?.user?.profile?.profileImageUrl || '';

        if (imageFile) {
            const formDataImage = new FormData();
            formDataImage.append('file', imageFile);
            formDataImage.append('upload_preset', 'profile_images');

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formDataImage,
                }
            );
            const uploadData = await uploadRes.json();
            if (uploadData.secure_url) {
                profileImageUrl = uploadData.secure_url;
            } else {
                toast.error('Image upload failed');
                return;
            }
        }

        try {
            const res = await fetch('/api/user/update-profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, profileImageUrl }),
            });
            if (res.ok) {
                toast.success('Profile updated successfully');
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        profile: { ...session.user.profile, ...formData, profileImageUrl },
                    },
                });
                setImageFile(null);
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <div className="flex flex-col items-center gap-4">
                        <UserIcon className="w-12 h-12 text-gray-400" />
                        <p className="text-lg font-medium">Please sign in to view your profile</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form>

            {/* Profile section */}
            <div className="px-4 py-6 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg/6 font-medium text-gray-900">Profile</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        This information will be displayed publicly so be careful what you share.
                    </p>
                </div>

                <div className="mt-6 flex flex-col lg:flex-row">
                    <div className="grow space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-sky-600">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                                        chillmeal.vercel.app/
                                    </div>
                                    <input
                                        defaultValue={formData.name.trim().toLowerCase().replace(/\s+/g, '')}
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="janesmith"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                Full name
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-sky-600">

                                    <input
                                        value={formData.name}
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="janesmith"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
                                About
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="about"
                                    name="about"
                                    rows={3}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                                    defaultValue={''}
                                />
                            </div>
                            <p className="mt-3 text-sm/6 text-gray-500">Write a few sentences about yourself.</p>
                        </div>
                    </div>

                    <div className="mt-6 grow lg:mt-0 lg:ml-6 lg:shrink-0 lg:grow-0">
                        <p aria-hidden="true" className="text-sm/6 font-medium text-gray-900">
                            Photo
                        </p>
                        <div className="mt-2 lg:hidden">
                            <div className="flex items-center">
                                <div
                                    aria-hidden="true"
                                    className="inline-block size-12 shrink-0 overflow-hidden rounded-full"
                                >
                                    <img alt=""

                                        src={user.imageUrl}

                                        className="size-full rounded-full" />
                                </div>
                                <div className="relative ml-5">
                                    <input
                                        id="mobile-user-photo"
                                        name="user-photo"
                                        type="file"
                                        className="peer absolute size-full rounded-md opacity-0"
                                    />
                                    <label
                                        htmlFor="mobile-user-photo"
                                        className="pointer-events-none block rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset peer-hover:ring-gray-400 peer-focus:ring-2 peer-focus:ring-sky-500"
                                    >
                                        <span>Change</span>
                                        <span className="sr-only"> user photo</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden overflow-hidden rounded-full lg:block">
                            <img
                                alt="User"
                                src={previewUrl || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}
                                className="relative size-40 rounded-full object-cover"
                            />
                            <label
                                htmlFor="desktop-user-photo"
                                className="absolute inset-0 flex size-full items-center justify-center bg-black/75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                            >
                                <span>Change</span>
                                <span className="sr-only">user photo</span>
                                <input
                                    id="desktop-user-photo"
                                    name="user-photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 size-full cursor-pointer rounded-md border-gray-300 opacity-0"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                            Height (cm)
                        </label>
                        <div className="mt-2">
                            <input
                                id="height"
                                type="number"
                                value={formData.height}
                                onChange={(e) => handleChange('height', e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                            Weight (kg)
                        </label>
                        <div className="mt-2">
                            <input
                                id="weight"
                                type="number"
                                value={formData.weight}
                                onChange={(e) => handleChange('weight', e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                            />
                        </div>
                    </div>


                    <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="company" className="block text-sm/6 font-medium text-gray-900">
                            Company
                        </label>
                        <div className="mt-2">
                            <input
                                id="company"
                                name="company"
                                type="text"
                                autoComplete="organization"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy section */}
            <div className="divide-y divide-gray-200 pt-6">
                <div className="px-4 sm:px-6">
                    <div>
                        <h2 className="text-lg/6 font-medium text-gray-900">Privacy</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Ornare eu a volutpat eget vulputate. Fringilla commodo amet.
                        </p>
                    </div>
                    <ul role="list" className="mt-2 divide-y divide-gray-200">
                        <Field as="li" className="flex items-center justify-between py-4">
                            <div className="flex flex-col">
                                <Label as="p" passive className="text-sm/6 font-medium text-gray-900">
                                    Available to hire
                                </Label>
                                <Description className="text-sm text-gray-500">
                                    Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia.
                                </Description>
                            </div>
                            <Switch
                                checked={availableToHire}
                                onChange={setAvailableToHire}
                                className="group relative ml-4 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden data-checked:bg-teal-500"
                            >
                                <span
                                    aria-hidden="true"
                                    className="inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                                />
                            </Switch>
                        </Field>
                        <Field as="li" className="flex items-center justify-between py-4">
                            <div className="flex flex-col">
                                <Label as="p" passive className="text-sm/6 font-medium text-gray-900">
                                    Make account private
                                </Label>
                                <Description className="text-sm text-gray-500">
                                    Pharetra morbi dui mi mattis tellus sollicitudin cursus pharetra.
                                </Description>
                            </div>
                            <Switch
                                checked={privateAccount}
                                onChange={setPrivateAccount}
                                className="group relative ml-4 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden data-checked:bg-teal-500"
                            >
                                <span
                                    aria-hidden="true"
                                    className="inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                                />
                            </Switch>
                        </Field>
                        <Field as="li" className="flex items-center justify-between py-4">
                            <div className="flex flex-col">
                                <Label as="p" passive className="text-sm/6 font-medium text-gray-900">
                                    Allow commenting
                                </Label>
                                <Description className="text-sm text-gray-500">
                                    Integer amet, nunc hendrerit adipiscing nam. Elementum ame
                                </Description>
                            </div>
                            <Switch
                                checked={allowCommenting}
                                onChange={setAllowCommenting}
                                className="group relative ml-4 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden data-checked:bg-teal-500"
                            >
                                <span
                                    aria-hidden="true"
                                    className="inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                                />
                            </Switch>
                        </Field>
                        <Field as="li" className="flex items-center justify-between py-4">
                            <div className="flex flex-col">
                                <Label as="p" passive className="text-sm/6 font-medium text-gray-900">
                                    Allow mentions
                                </Label>
                                <Description className="text-sm text-gray-500">
                                    Adipiscing est venenatis enim molestie commodo eu gravid
                                </Description>
                            </div>
                            <Switch
                                checked={allowMentions}
                                onChange={setAllowMentions}
                                className="group relative ml-4 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden data-checked:bg-teal-500"
                            >
                                <span
                                    aria-hidden="true"
                                    className="inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                                />
                            </Switch>
                        </Field>
                    </ul>
                </div>
                <div className="mt-4 flex justify-end gap-x-3 px-4 py-4 sm:px-6">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md bg-sky-700 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    )
}
