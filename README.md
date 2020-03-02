# Epicalendar V2

Epicalendar is a tool to synchronize Epitech's intranet calendar to any ICalendar compatible service.
(Example: Google Calendar, Apple Calendar, Outlook Calendar)

This version was developed using nodeJS and express. You can find the first version [here](https://github.com/simonmeyerrr/epicalendar) which was developed using Golang.

Visit the website [the website](https://epicalendarv2.omnirem.dev) for more information.


### How to use it

"Add a calendar from a URL" with your favorite calendar and use one of the following url:

- #### `https://epicalendarv2.omnirem.dev/:autologin/planning.ics` :

    This allows you to see all the activities to which you are registered. Appointment slots such as Follow-Up and Review are taken into account and only your slot will be displayed. Compatible with educational accounts.

- #### `https://epicalendarv2.omnirem.dev/:autologin/projects.ics` :

    This allows you to see all the projects you are registered for with their start and end dates.

- #### `https://epicalendarv2.omnirem.dev/:autologin/projects-end.ics` :

    This displays the project rendering dates. You can set up alarms to warn you when a project is about to finish.


You have to replace `:autologin` in the url by your autologin code that you can find on [this page](https://intra.epitech.eu/admin/autolog).

Your autologin code is not saved in any database or in server's logs. If you still don't trust the service, you can host it on your personal server.


### Host it by yourself

You can host this service on your own server. No configuration is required outside the port to be used. You just have to install nodeJS.

```bash
git clone https://github.com/simonmeyerrr/epicalendarV2.git
cd epicalendarV2
npm install
PORT=8080 node index.js
```