# local-file-sharing
A local file sharing server developed with Node JS, Express, File-Upload and Socket IO. Suitable for small offices and companies that are connected to the same network. 
Clone the repo and install using (Assuming you already have Node JS installed onto your machine)
```node js
npm install
```

Get the Local IP address of the machine that is running this process and open it in browser along with the port ```8009```. It will be something like ```http://192.168.0.3:8009```
Use the same address on other computers you want to share the files with. All the machines will be in sync since the websockets track all the requests and auto update the UI.

# Packages Used
1. Express
2. Body Parser
3. Express handlebars
4. Express fileupload
5. Socket IO

![Alt File Sharing Process](https://htmljstemplates.com/static_files/images/gitted/officeFileSharing.gif)
