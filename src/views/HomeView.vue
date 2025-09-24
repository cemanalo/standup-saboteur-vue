<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
    <!-- Title -->
    <h1 class="text-5xl font-extrabold text-blue-700 mb-6">Stand-up Saboteur</h1>

    <!-- Rule Illustration -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-xs w-xs">
      <h2 class="text-xl font-semibold mb-4">How it works</h2>
      <img
        size="300x200"
        src="@/assets/rules-illustration.jpeg"
        alt="Game rules illustration"
        class="rounded-lg shadow-xs w-xs"
      />
    </div>

    <!-- CTA Buttons -->
    <div class="flex space-x-4">
      <router-link
        to="/join"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
      >
        Join Game
      </router-link>

      <router-link
        to="/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
      >
        Create New Game
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
