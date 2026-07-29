# ⚡ Assignment Shortcuts

This repository automatically generates hosted shortcuts and raw bookmarklets based on `shortcuts.json`.

## 📌 Direct Bookmarklets (Copy & Paste)

If you want to paste the code directly into your browser's URL field for standard bookmarklets, copy the code blocks below:


### 👨‍⚕️ Assign to Justin Copitch
* **Type:** `person`
* **Target:** `COPITCH, JUSTIN`

```javascript
javascript:(function(){Array.from(document.querySelectorAll('button')).find(b=>b.innerText.includes('Assigned to Group'))?.click();setTimeout(()=>{const input=document.getElementById('ug_filter');if(input){input.focus();input.click();input.value="COPITCH, JUSTIN";input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));setTimeout(()=>{const th=Array.from(document.querySelectorAll('th')).find(th=>th.innerText.includes("COPITCH, JUSTIN"));if(th){th.click();th.querySelector('span')?.click();}},300);}},500);})();
```

---

### 🦴 Assign to MSK Group
* **Type:** `group`
* **Target:** `Group: MSK`

```javascript
javascript:(function(){Array.from(document.querySelectorAll('button')).find(b=>b.innerText.includes('Assigned to Group'))?.click();setTimeout(()=>{const th=Array.from(document.querySelectorAll('th')).find(th=>th.innerText.includes("Group: MSK"));if(th){th.click();th.querySelector('span')?.click();}},500);})();
```

