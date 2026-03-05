// 通用音频播放器生成器
function createAudioHTML(path) {
    return `<audio controls controlslist="nodownload" class="px-1">
                <source src="${path}" type="audio/wav">
            </audio>`;
}

// 轻量级 CSV 解析器
async function fetchCSVData(csvUrl) {
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const textData = await response.text();
        
        const lines = textData.trim().split('\n');
        if (lines.length < 2) return []; // 只有表头或为空
        
        const headers = lines[0].split(',').map(h => h.trim());
        const dataList = [];
        
        for (let i = 1; i < lines.length; i++) {
            // 简单处理逗号分割（如果您的文本中含有逗号，建议将文本用双引号括起来，这里暂用简单split演示）
            // 更严谨的话建议使用 PapaParse 库，这里为了零依赖手写了正则分割
            const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split('|');
            
            let obj = {};
            headers.forEach((h, idx) => {
                let val = values[idx] ? values[idx].trim() : "XXX"; // 如果为空显示 XXX
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.substring(1, val.length - 1); // 去除双引号
                }
                obj[h] = val;
            });
            dataList.push(obj);
        }
        return dataList;
    } catch (error) {
        console.error(`Failed to load ${csvUrl}:`, error);
        return []; 
    }
}

// 表格 1 渲染逻辑
async function renderTable1() {
    const dataList = await fetchCSVData('table/table1-persona.csv');
    const tbody = document.querySelector('#table1 tbody');
    if(dataList.length === 0) tbody.innerHTML = '<tr><td colspan="6">No data loaded (Please ensure table/table1-persona.csv exists)</td></tr>';
    
    dataList.forEach(data => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="instruction-cell">${data.instruction || 'XXX'}</td>
            <td class="text-cell">${data.text || 'XXX'}</td>
            <td>${createAudioHTML(`data/CosyVoice2/${data.id}.wav`)}</td>
            <td>${createAudioHTML(`data/VoxInstruct/${data.id}.wav`)}</td>
            <td>${createAudioHTML(`data/VoiceSculptor/${data.id}.wav`)}</td>
            <td>${createAudioHTML(`data/CharacterVoice/${data.id}.wav`)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 表格 2 渲染逻辑
async function renderTable2() {
    const dataList = await fetchCSVData('table/table2-ablation.csv');
    const tbody = document.querySelector('#table2 tbody');
    if(dataList.length === 0) tbody.innerHTML = '<tr><td colspan="4">No data loaded</td></tr>';

    dataList.forEach(data => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="instruction-cell">${data.instruction || 'XXX'}</td>
            <td class="text-cell">${data.text || 'XXX'}</td>
            <td>${createAudioHTML(`data/Baseline/${data.id}.wav`)}</td>
            <td>${createAudioHTML(`data/CharacterVoice/${data.id}.wav`)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 表格 3 渲染逻辑 (一行包含4个生成的音频)
async function renderTable3() {
    const dataList = await fetchCSVData('table/table3-consistency.csv');
    const tbody = document.querySelector('#table3 tbody');
    if(dataList.length === 0) tbody.innerHTML = '<tr><td colspan="6">No data loaded</td></tr>';

    dataList.forEach(data => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="instruction-cell">${data.instruction || 'XXX'}</td>
            <td class="text-cell">${data.text || 'XXX'}</td>
            <td>${createAudioHTML(`data/CharacterVoice/${data.id}_1.wav`)}</td>
            <td>${createAudioHTML(`data/CharacterVoice/${data.id}_2.wav`)}</td>
            <td>${createAudioHTML(`data/CharacterVoice/${data.id}_3.wav`)}</td>
            <td>${createAudioHTML(`data/CharacterVoice/${data.id}_4.wav`)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 表格 4 渲染逻辑 (Instruction Robustness - 包含Text列的纵向合并 Rowspan)
async function renderTable4() {
    const dataList = await fetchCSVData('table/table4-diversity.csv');
    const tbody = document.querySelector('#table4 tbody');
    if(dataList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">No data loaded</td></tr>';
        return;
    }

    // 提取所有行共用的 Text
    const sharedText = dataList[0].text || 'XXX';

    dataList.forEach((data, index) => {
        let tr = document.createElement('tr');
        
        let html = `<td class="instruction-cell">${data.instruction || 'XXX'}</td>`;
        
        // 只有第一行需要渲染 Text 单元格，并设置 rowspan 合并
        if (index === 0) {
            html += `<td class="text-cell" rowspan="${dataList.length}">${sharedText}</td>`;
        }
        
        html += `<td>${createAudioHTML(`data/CharacterVoice/${data.id}.wav`)}</td>`;
        tr.innerHTML = html;
        tbody.appendChild(tr);
    });
}

// 页面加载完成后触发所有表格的数据请求和渲染
document.addEventListener("DOMContentLoaded", () => {
    renderTable1();
    renderTable2();
    renderTable3();
    renderTable4();
});