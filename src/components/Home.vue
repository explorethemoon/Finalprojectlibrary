<template lang="pug">
  .content-wrapper
    section
      .container
        h1.ui-title-1 Home
        input(
          type="text"
          placeholder="With what we will work?"
          v-model="taskTitle"
          @keyup.enter="newTask"
        )
        textarea(
          type="text"
          v-model="taskDescription"
          @keyup.enter="newTask"
        )
        .option-list
          input.what-open--radio(
            type="radio"
            id="radioProject"
            value="Project"
            v-model="whatOpen"
          )
          label(
            for="radioProject"
          ) Project
          input.what-open--radio(
            type="radio"
            id="radioTask"
            value="Task"
            v-model="whatOpen"
          )
          label(
            for="radioTask"
          ) Task
        // TOTAL TIME
        .total-time

          // Project Time
          .total-time__project(
            v-if="whatOpen === 'Project'"
          )
            span Total Project Times 
            span.time-title Months
            input.time-input(
              type="number"
              v-model="projectMonths"
            )
            span.time-title Days
            input.time-input(
              type="number"
              v-model="projectDays"
            )

            p {{ projectTime }}

          // Task Time
          .total-time__task(
            v-if="whatOpen === 'Task'"
          )
            span.time-title How many tasks??
            input.time-input(
              type="number"
              v-model="taskAmount"
            )
            span.time-title How many sub-items in the task??
            input.time-input(
              type="number"
              v-model="subtaskAmount"
            )
            span.time-title How much time allotted for the task? (days)
            input.time-input(
              type="number"
              v-model="AllottedTime"
            )
            p {{ taskTime }}

        // TAG LIST
        // Add  New Tag
        .tag-list.tag-list--add
          .ui-tag__wrapper(
            @click="tagMenuShow = !tagMenuShow"
          )
            .ui-tag
              span.tag-title Add New
              span.button-close(
                :class="{ active: !tagMenuShow }"
              )

        // Show Input
        .tag-list.tag-list--menu(
          v-if="tagMenuShow"
        )
          input.tag-add--input(
            type="text"
            placeholder="New tag"
            v-model="tagTitle"
            @keyup.enter="newTag"
          )
          .button.button-default(
            @click="newTag"
          ) Send

        //All Tags
        .tag-list
          .ui-tag__wrapper(
            v-for="tag in tags"
            :key="tag.title"
          )
            .ui-tag(
              @click="addTagUsed(tag)"
              :class="{used: tag.use}"
            )
              span.tag-title {{ tag.title }}
              span.button-close

          p {{ tagsUsed}}

          .button-list
          .button.button--round.button-primary(
            @click="newTask"
          ) Send
    
</template>

<script>
export default {
  data () {
    return {
      taskTitle: '',
      taskDescription: '',
      whatOpen: 'Project',

     // Total Time
      // Project
      projectMonths: 1,
      projectDays: 29,
      // Task
      taskAmount: 1,
      subtaskAmount: 11,
      AllottedTime: 40, 

     //Tags
     tagTitle: '',
     tagMenuShow: false,
     tagsUsed:[],
    }
  },
    methods: {
    newTag () {
      if (this.tagTitle === '') {
        return
      }
       const tag = {
        title: this.tagTitle,
        use: false
       }
       this.$store.dispatch('newTag', tag)
    },
    // Add Used Tag
    addTagUsed (tag) {
      tag.use = !tag.use
      if (tag.use) {
        this.tagsUsed.push({
          title: tag.title
        })
      } else {
        this.tagsUsed.splice(tag.title, 1)
      }
    },

    
    newTask () {
      if (this.taskTitle === '') {
        return
      }
      let time 
      if (this.whatOpen === 'Project'){
        time = this.projectTime
      }else{
        time = this.taskTime
      }
      const task ={
        
        title: this.taskTitle,
        description: this.taskDescription,
        whatOpen: this.whatOpen,
        time,
        tags: this.tagsUsed,
        completed: false,
        editing: false
      }
      this.$store.dispatch('newTask', task)
      console.log(task)
      
      // Reset
      this.taskTitle = ''
      this.taskDescription = ''
      // Reset for Tags
      this.tagMenuShow = false
      this.tagTitle = ''
      this.tagsUsed = []
      for (let i = 0; i < this.tags.length; i++) {
        this.tags[i].use = false
      }
    },
     // Total Time
    getMonthsandDays (days) {
      let months = Math.trunc(days/30)
      let min = days % 30
      return months + ' Months ' + min + ' Days '
   }
  },
  computed: {
    tags () {
      return this.$store.getters.tags
    },
    // Total Time
    projectTime (){
      let min = (this.projectMonths*30) + (this.projectDays * 1)
      return this.getMonthsandDays(min)
    },
    taskTime (){ 
      let min = this.AllottedTime*1
      return this.getMonthsandDays(min)
    },
  }
}
</script>

<style lang="stylus" scoped>
// Options
.option-list
  display flex
  align-items center
  margin-bottom 20px
  .what-watch--radio
    margin-right 12px
  input
    margin-bottom 0
  label
    margin-right 20px
    margin-bottom 0
    &:last-child
      margin-right 0

    // Total time
.total-time
  margin-bottom 20px
.time-title
  display block
  margin-bottom 6px
.time-input
  max-width 80px
  margin-right 10px

// Tags
.tag-list
  margin-bottom 20px
.ui-tag__wrapper
  margin-right 18px
  margin-bottom 10px
  &:last-child
    margin-right 0
.ui-tag
  &.used
    background-color: #444ce0
    color #fff
    .button-close
      &:before,
      &:after
        background-color: #fff
  .button-close
    &.active
      transform: rotate(45deg)
// Tag Menu Show
.tag-list--menu
  display flex
  justify-content space-between
  align-items center
  //margin-bottom 18px
  //.ui-checkbox-wrapper
   // margin-right 8px
  //.ui-title-3
   // margin-bottom 0

// New Tag Input
.tag-add--input
  margin-bottom 0
  margin-right 10px
  height 42px

// Total Time
.total-time
  p
    margin-bottom 6px
  span
    margin-right 16px
  .task-input
    max-width 80px
    margin-bottom 28px
    margin-right 10px
.button-list
  display flex
  justify-content flex-end
</style>