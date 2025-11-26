import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    const getInitials = (name) => {
        if (!name) return "";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (
            parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };

    if (!user.is_ehs_manager && !user.is_super_admin) {
        return (
            <section className={className}>
                <header className="flex items-center justify-between lg:items-start lg:flex-col lg:justify-start">
                    <h2 className="text-lg font-medium text-gray-900">
                        Información del Perfil
                    </h2>
                    <div className="flex items-center gap-4 mr-6 lg:ml-14 lg:py-4">
                        <div className="h-16 w-16 lg:h-14 lg:w-14 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-bold text-lg shadow-md ">
                            {getInitials(user.name)}{" "}
                        </div>
                    </div>
                </header>

                <div className="mt-2 space-y-6">
                    <p className="mt-1 text-sm text-gray-600">
                        ¿Necesitas actualizar <br /> tu información? <br />
                        <a
                            href="https://wasionithelp.freshservice.com"
                            className="text-wasion hover:underline"
                        >
                            Contacta a IT
                        </a>
                    </p>
                    <div>
                        <InputLabel htmlFor="name" value="Nombre" />
                        <div className="block w-full px-3 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
                            {user.name}
                        </div>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Correo Electrónico"
                        />
                        <div className="block w-full px-3 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
                            {user.email}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Información del Perfil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Actualiza la información de tu perfil y dirección de correo
                    electrónico.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nombre" />

                    <TextInput
                        id="name"
                        className="block w-full mt-1"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" />

                    <TextInput
                        id="email"
                        type="email"
                        className="block w-full mt-1"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Tu dirección de correo electrónico no está
                            verificada.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Haz clic aquí para reenviar el correo de
                                verificación.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Se ha enviado un nuevo enlace de verificación a
                                tu correo electrónico.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Guardado.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
