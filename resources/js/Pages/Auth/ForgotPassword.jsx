import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar Contraseña" />

            <h2 className="mb-6 text-xl font-semibold text-center text-blue-900 dark:text-blue-300">
                Recuperar Contraseña
            </h2>

            <div className="mb-4 text-sm text-center text-gray-600 dark:text-gray-300">
                ¿Olvidó su contraseña?
                <br />
                <br />
                <span>
                    <strong>No hay problema.</strong> Ingrese su correo
                    electrónico y le enviaremos un enlace para restablecer su
                    contraseña.
                </span>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col">
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="correo@wasion.com"
                />

                <InputError message={errors.email} className="mt-2" />

                <PrimaryButton className="w-full mt-6" disabled={processing}>
                    Enviar Enlace de Recuperación
                </PrimaryButton>

                <Link
                    href="/"
                    className="flex items-end justify-end py-2 text-sm text-gray-600 dark:text-gray-400 underline rounded-md hover:text-gray-900 dark:hover:text-gray-200"
                >
                    Regresar al inicio
                </Link>
            </form>
        </GuestLayout>
    );
}
