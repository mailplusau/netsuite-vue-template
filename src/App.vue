<template>
    <v-app :style="{background: $vuetify.theme.themes[theme].background}">
        <v-main>
            <v-container fluid>
                <v-row class="mx-1" justify="space-between" align="center">
                    <v-col cols="auto">
                        <h1 class="primary--text">
                            Test Page
                        </h1>
                    </v-col>

                    <v-col cols="auto">
                        <a @click="$store.dispatch('addShortcut')" class="subtitle-1">Add To Shortcuts <v-icon size="20" color="primary">mdi-open-in-new</v-icon></a>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>

        <GlobalNotificationModal />
    </v-app>
</template>

<script>
import GlobalNotificationModal from "@/components/GlobalNotificationModal";

export default {
    name: 'App',
    components: {
        GlobalNotificationModal,
    },
    computed:{
        theme(){
            return (this.$vuetify.theme.dark) ? 'dark' : 'light'
        }
    }
};
</script>
