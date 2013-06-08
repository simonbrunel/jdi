/*
 * This file is part of JDI.
 * Copyright (c) 2013 Simon Brunel.
 * Contact: http://www.github.com/simonbrunel
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @class App.util.Strings
 * @author Simon Brunel
 *
 * All application UI strings.
 */
Ext.define('App.util.Strings', {

    statics: {

        // Help / Overview
        'help_toolbar':
            '<ol><li> Help/About' +
            '<li> Create a new task' +
            '<li> Start a JDI session' +
            '<li> Display account details' +
            '</ol><hr/>',

        'help_account_brief':
            'If your email is registered to Gravatar, JDI retrieves ' +
            'and displays your name and picture.',

        'help_account_legend':
            '<ol><li> User avatar (Gravatar)' +
            '<li> User name (Gravatar)' +
            '<li> User email used to sign in' +
            '<li> Button to sign out' +
            '</ol>',

        // Help / Task Create
        'help_create_form_legend':
            '<ol><li> Task description' +
            '<li> Task due date' +
            '<li> Task duration (in minutes)' +
            '</ol><hr/>',

        'help_create_actions_legend':
            '<ol><li> Create the task (and sync it to the cloud)' +
            '<li> Cancel creation' +
            '</ol>',

        // Help / Task List
        'help_tasklist_brief':
            'All created tasks (except the ones deleted) are displayed ' +
            'in the task list and grouped by due dates (late, ' +
            'today, soon and someday).' +
            '<hr/>',

        'help_tasklist_elements':
            '<ol><li> Group name' +
            '<li> Task duration' +
            '<li> Task due date' +
            '<li> Task description' +
            '<li> Completed task are gray out' +
            '</ol><hr/>',

        'help_tasklist_actions':
            '<ol><li> Swipe vertically to navigate in your tasks' +
            '<li> Swipe right to complete an active task' +
            '<li> Swipe left to re-activate a completed task' +
            '<li> Swipe right to delete a completed task' +
            '</ol>',

        // Help / Task Panel
        'help_taskpanel_brief':
            'The task info panel provides information on current item in the ' +
            'task list. On mobile, this panel is only visible  when a task is ' +
            'selected.' +
            '<hr/>',

        'help_taskpanel_elements':
            '<ol><li> Full task description' +
            '<li> Creation, due and completed dates' +
            '<li> Task duration' +
            '<li> Swipe right the panel or use the button to close it' +
            '</ol><hr/>',

        'help_taskpanel_actions':
            '<ol><li> Complete or re-activate a task' +
            '<li> Edit task details (see below)' +
            '<li> Delete the task, once deleted it will ' +
            'not be visible anymore in the task list' +
            '</ol><hr/>',

        'help_taskedit_form':
            '<ol><li> Task description' +
            '<li> Task due date' +
            '<li> Task duration (in minutes)' +
            '</ol><hr/>',

        'help_taskedit_actions':
            '<ol><li> Modify the task (and sync it to the cloud)' +
            '<li> Cancel modifications' +
            '</ol>',

        // Help / Session
        'help_session_brief':
            'Have spare time and so many tasks to get done, but don\'t know ' +
            'where to start? Just start a JDI session and let the app picks ' +
            'the tasks you should do right now!',

        'help_session_setup':
            '<ol><li> Swipe vertically to select a duration (60 minutes maximum)' +
            '<li> Number of tasks matching the selected duration (e.g. 4 tasks ' +
            'out of 11 can be done in 24 minutes)' +
            '<li> Start the session (disabled if there is no matching tasks)' +
            '<li> Close the session panel' +
            '</ol><hr/>',

        'help_session_running':
            '<ol><li> Session remaining time' +
            '<li> Remaining tasks for this session (e.g. 2 tasks ' +
            'out of 4 remain doable during the session)' +
            '<li> Number of tasks completed during the session' +
            '<li> Stop the session and close the panel' +
            '</ol><hr/>',

        'help_session_actions':
            '<ol><li> Swipe left to postpone an active task' +
            '<li> Swipe right to complete an active task' +
            '<li> Swipe left to re-activate a completed task' +
            '<li> Swipe right to delete a completed task' +
            '</ol>' +
            'Tasks are grouped in the following categories:' +
            '<ul><li> <strong>Active:</strong> tasks still doable' +
            '<li> <strong>Done:</strong> tasks done during the session' +
            '<li> <strong>Postponed:</strong> tasks to do later' +
            '<li> <strong>Out of time:</strong> tasks for which the duration ' +
            'exceeds the remaining time' +
            '</ul>',

        // Welcome
        'welcome_brief':
            'Developed for the "HTML5 is Ready App Contest", ' +
            'JDI offers you a new way to prioritize your tasks.',

        'welcome_description':
            'JDI give you the force to get your tasks done, just do it now!',

        // About
        'about_version':
            '<strong>JDI version ' + appInfo.version + '</strong><br/>' +
            'Copyright &copy; 2013 Simon Brunel <br/>' +
            'http://www.linkedin.com/in/simonbrunel' +
            '<hr/>',

        'about_brief':
            'Original, creative and user-friendly, JDI is an innovative ' +
            'web app using the power of HTML5/CSS3 featuring Sencha Touch. '+
            'Compatible with most of today\'s Android and iOS devices, ' +
            'user\'s data remain synchronized in the cloud using Sencha IO.',

        'about_details':
            'JDI uses the following technologies: ' +
            '<ul><li> Sencha Touch 2.2.1' +
            '<li> Sencha.io 0.7.13' +
            '<li> Gravatar APIs' +
            '</ul>',

        // Messages
        'message_samples_warning_title':
            'Installation Warning!',

        'message_samples_warning_text':
            'You are about to generate tasks over existing ones, which can ' +
            'mess up your current task organisation. Do you want to ' +
            'continue with the samples installation?',

        'message_samples_installed_title':
            'Install Succeeded',

        'message_samples_installed_text':
            '{0} tasks have been successfully generated and synchronized.'
    }
});