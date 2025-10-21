<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar/'
import Button from '~/components/ui/button/Button.vue'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '~/components/ui/item/'

const people = [
  {
    username: 'HannesGao',
    avatar: 'https://github.com/hannesgao.png',
    email: 'hannes.gao@gmail.com',
    donation: 1431,
  },
  {
    username: 'LemonNeko',
    avatar: 'https://github.com/LemonNekoGH.png',
    email: 'self@lemonneko.moe',
    donation: 142126,
  },
  {
    username: 'Doji',
    avatar: 'https://github.com/BeanDz.png',
    email: 'doji_rua@outlook.com',
    donation: 42,
  },
]
</script>

<template>
  <div class="mx-auto pt-20">
    <h1 class="mb-6 text-3xl text-gray-800 font-bold dark:text-white">
      超级神秘的在募资的杂鱼项目
    </h1>
    <h2 class="mb-4 text-2xl text-gray-800 font-medium dark:text-white">
      目标：12315 条小鱼干
    </h2>
    <h2 class="mb-4 text-2xl text-gray-800 font-medium dark:text-white">
      已得到：114514 条小鱼干
    </h2>
    <h2 class="mb-4 text-2xl text-gray-800 font-medium dark:text-white">
      截止日期：2048-02-48
    </h2>
    <Button class="mb-20 rounded-md bg-black px-2 text-white shadow-md transition-colors duration-200 hover:bg-gray-800">
      小鱼干给你了！
    </Button>
    <h2 class="mb-4 text-2xl text-gray-800 font-medium dark:text-white">
      这些豪猫捐赠了这个项目：
    </h2>
    <div class="mx-auto max-w-md w-full flex flex-col gap-6">
      <ItemGroup>
        <template v-for="(person, index) in people" :key="person.username">
          <Item>
            <ItemMedia>
              <Avatar>
                <AvatarImage :src="person.avatar" />
                <AvatarFallback>{{ person.username.charAt(0) }}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent class="gap-2">
              <ItemTitle>{{ person.username }}</ItemTitle>
              <ItemDescription>{{ person.email }}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ItemDescription class="text-green-600 dark:text-green-400">
                捐赠：{{ person.donation }} 条小鱼干
              </ItemDescription>
            </ItemActions>
          </Item>
          <ItemSeparator v-if="index !== people.length - 1" />
        </template>
      </ItemGroup>
    </div>
  </div>
</template>
