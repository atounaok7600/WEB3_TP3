<script>

</script>

<template>
    <div class=" min-h-[100vh] flex justify-center items-center">
        <Form class="py-6 px-10 border rounded-lg shadow-md flex flex-col gap-8">
            <div class="flex flex-col items-center justify-center">
                <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="120" height="120" />
                <h2 class="text-5xl">Créer un compte</h2>
            </div>

            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label for="nom"><strong>Nom</strong></label>
                    <input type="text" name="nom" class="border px-3 py-2 rounded-md" placeholder="Ex: Luc Gagnon" required>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="mail"><strong>Courriel</strong></label>
                    <input type="text" name="mail" class="border px-3 py-2 rounded-md" placeholder="Ex: lgagnon@gmail.com" required>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="mdp"><strong>Mot de passe</strong></label>
                    <input type="text" name="mdp" class="border px-3 py-2 rounded-md" placeholder="Mot de passe" required>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="cmpd"><strong>Confirmer mot de passe</strong></label>
                    <input type="text" name="cmdp" class="border px-3 py-2 rounded-md" placeholder="Confirmer mot de passe" required>
                </div>
                <div class="flex justify-between gap-4">
                    <input type="submit" class="border w-full py-2 px-4 bg-orange-400 hover:cursor-pointer hover:bg-orange-500">
                    <input type="reset" class="border w-full py-2 px-4 bg-slate-200 hover:cursor-pointer hover:bg-slate-300">
                </div>
            </div>
        </Form>
    </div>
</template>
