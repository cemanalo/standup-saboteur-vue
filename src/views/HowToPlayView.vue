<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
    <!-- Title -->
    <h1 class="text-3xl font-bold text-indigo-600 mb-6">How to Play – Stand-up Saboteur</h1>

    <div class="bg-white shadow-md rounded-xl p-6 w-full max-w-3xl space-y-6">
      <!-- Roles -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">🎭 Roles</h2>
        <p class="text-gray-600">Each player is secretly assigned a role:</p>
        <ul class="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li><strong>Contributor (Good Guy):</strong> Earns points.</li>
          <li><strong>Blocker (Bad Guy):</strong> Sabotages Contributors.</li>
        </ul>
        <p class="mt-2 text-gray-600">
          Roles are hidden — you won’t know yours or anyone else’s until the end.
        </p>
      </section>

      <!-- Game Flow -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">📅 Game Flow</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li>The game runs <strong>Monday to Friday</strong>.</li>
          <li>Each day, you can make up to <strong>3 pairings</strong>.</li>
          <li>Pairings reset daily, but roles stay the same all week.</li>
          <li>
            On <strong>Friday</strong>, final scores are revealed and the player with the highest
            total wins.
          </li>
        </ul>
      </section>

      <!-- Pairing Rules -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">🔗 Pairing Rules</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li>You can send pairing requests to other players.</li>
          <li>
            Once you send or receive a request, you can’t pair again with that same player on that
            day.
          </li>
          <li>Players may <strong>accept</strong> or <strong>decline</strong> requests.</li>
        </ul>
      </section>

      <!-- Scoring -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">🏆 Scoring</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li><strong>Contributor + Contributor:</strong> Both earn 1 point.</li>
          <li>
            <strong>Contributor + Blocker:</strong><br />
            Contributor → becomes a Blocker and resets to 0 points.<br />
            Blocker → becomes a Contributor with 0 points.
          </li>
        </ul>
        <p class="mt-2 text-gray-600">Be careful who you pair with!</p>
        <p class="mt-4 text-gray-600">At the <strong>end of each day</strong>:</p>
        <ul class="list-disc list-inside text-gray-700 mt-1 space-y-1">
          <li>Daily scores are recorded.</li>
          <li>All scores reset to 0 (roles do not change).</li>
        </ul>
        <p class="mt-4 text-gray-600">
          At the <strong>end of the week</strong>, all daily scores are tallied and the player with
          the highest total score is the winner.
        </p>
      </section>
    </div>

    <!-- Back Button -->
    <div class="mt-8">
      <button
        @click="goBack"
        class="px-6 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
      >
        ⬅ Back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>
