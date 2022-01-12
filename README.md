# geneEditor
A web based DNA editor written in pure JS


<img src="https://github.com/lrondanini/geneEditor/blob/main/video.gif" alt="drawing" width="50%"/>

## INSTALL

```
npm install
```

## RUN

```
npm run start
```


## INITIALIZE

```
    let options = {
		basesPerLine: 60,
		onChange: function(status) {
			//console.log(status);
		}
	}

	editorInstance = new GeneEditor.GeneEditor("editor", options);

	editorInstance.LoadFromString("TGCACATGCA");
	
```

