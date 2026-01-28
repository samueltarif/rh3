/**
 * Composable para debug de z-index e stacking context
 * Útil para identificar problemas de sobreposição
 */

export const useZIndexDebug = () => {
  const isDebugging = ref(false)
  
  /**
   * Ativar/desativar modo debug
   */
  const toggleDebug = () => {
    isDebugging.value = !isDebugging.value
    
    if (isDebugging.value) {
      startDebug()
    } else {
      stopDebug()
    }
  }
  
  /**
   * Iniciar debug visual
   */
  const startDebug = () => {
    // Adicionar estilos de debug
    const style = document.createElement('style')
    style.id = 'z-index-debug'
    style.textContent = `
      /* Debug de Z-Index */
      [style*="z-index"], .z-\\[, [class*="z-"] {
        position: relative !important;
      }
      
      [style*="z-index"]:before, 
      .z-\\[:before,
      [class*="z-"]:before {
        content: attr(class) " | z:" attr(style);
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        font-size: 10px;
        padding: 2px 4px;
        border-radius: 2px;
        z-index: 99999;
        pointer-events: none;
        white-space: nowrap;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      /* Destacar elementos com stacking context */
      [style*="transform"], 
      [style*="opacity"], 
      [style*="filter"],
      [style*="position: fixed"],
      [style*="position: absolute"],
      [style*="position: relative"][style*="z-index"] {
        outline: 2px dashed orange !important;
        outline-offset: -2px;
      }
    `
    document.head.appendChild(style)
    
    // Log elementos problemáticos
    debugStackingContexts()
    
    console.log('🐛 Z-Index Debug Mode ATIVADO')
    console.log('💡 Elementos com outline laranja podem criar stacking context')
    console.log('💡 Labels vermelhos mostram z-index atual')
  }
  
  /**
   * Parar debug visual
   */
  const stopDebug = () => {
    const style = document.getElementById('z-index-debug')
    if (style) {
      style.remove()
    }
    
    console.log('🐛 Z-Index Debug Mode DESATIVADO')
  }
  
  /**
   * Analisar elemento específico
   */
  const analyzeElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (!element) {
      console.warn(`Elemento não encontrado: ${selector}`)
      return
    }
    
    const computedStyle = window.getComputedStyle(element)
    const stackingContext = checkStackingContext(element)
    
    console.group(`🔍 Análise: ${selector}`)
    console.log('Elemento:', element)
    console.log('Cria Stacking Context:', stackingContext)
    console.log('Z-Index:', computedStyle.zIndex)
    console.log('Position:', computedStyle.position)
    console.log('Transform:', computedStyle.transform)
    console.log('Opacity:', computedStyle.opacity)
    console.log('Filter:', computedStyle.filter)
    console.log('Isolation:', computedStyle.isolation)
    
    // Analisar pais
    let parent = element.parentElement
    let level = 1
    console.log('📊 Hierarquia de Stacking Context:')
    
    while (parent && level <= 10) {
      const parentStyle = window.getComputedStyle(parent)
      const parentStacking = checkStackingContext(parent)
      
      if (parentStacking) {
        console.log(`  ${level}. ${parent.tagName}.${parent.className}`, {
          zIndex: parentStyle.zIndex,
          position: parentStyle.position,
          transform: parentStyle.transform !== 'none' ? parentStyle.transform : undefined,
          opacity: parentStyle.opacity !== '1' ? parentStyle.opacity : undefined
        })
      }
      
      parent = parent.parentElement
      level++
    }
    
    console.groupEnd()
  }
  
  /**
   * Encontrar elementos com z-index alto
   */
  const findHighZIndex = (threshold = 1000) => {
    const elements = document.querySelectorAll('*')
    const highZElements: Array<{ element: HTMLElement, zIndex: number }> = []
    
    elements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el as HTMLElement)
      const zIndex = parseInt(computedStyle.zIndex)
      
      if (!isNaN(zIndex) && zIndex >= threshold) {
        highZElements.push({
          element: el as HTMLElement,
          zIndex
        })
      }
    })
    
    // Ordenar por z-index
    highZElements.sort((a, b) => b.zIndex - a.zIndex)
    
    console.group(`🔍 Elementos com Z-Index >= ${threshold}:`)
    highZElements.forEach(({ element, zIndex }, index) => {
      console.log(`${index + 1}. Z-Index: ${zIndex}`, {
        element,
        tagName: element.tagName,
        className: element.className,
        id: element.id
      })
    })
    console.groupEnd()
    
    return highZElements
  }
  
  /**
   * Verificar conflitos potenciais
   */
  const checkConflicts = () => {
    const modals = document.querySelectorAll('[role="dialog"], .modal, [class*="modal"]')
    const overlays = document.querySelectorAll('.overlay, [class*="overlay"], .backdrop, [class*="backdrop"]')
    const dropdowns = document.querySelectorAll('.dropdown, [class*="dropdown"], .popover, [class*="popover"]')
    
    console.group('🔍 Verificação de Conflitos:')
    
    console.log('Modais encontrados:', modals.length)
    modals.forEach((modal, index) => {
      const style = window.getComputedStyle(modal as HTMLElement)
      console.log(`  Modal ${index + 1}:`, {
        element: modal,
        zIndex: style.zIndex,
        position: style.position
      })
    })
    
    console.log('Overlays encontrados:', overlays.length)
    overlays.forEach((overlay, index) => {
      const style = window.getComputedStyle(overlay as HTMLElement)
      console.log(`  Overlay ${index + 1}:`, {
        element: overlay,
        zIndex: style.zIndex,
        position: style.position
      })
    })
    
    console.log('Dropdowns/Popovers encontrados:', dropdowns.length)
    dropdowns.forEach((dropdown, index) => {
      const style = window.getComputedStyle(dropdown as HTMLElement)
      console.log(`  Dropdown ${index + 1}:`, {
        element: dropdown,
        zIndex: style.zIndex,
        position: style.position
      })
    })
    
    console.groupEnd()
  }
  
  // Cleanup automático
  onUnmounted(() => {
    if (isDebugging.value) {
      stopDebug()
    }
  })
  
  return {
    isDebugging: readonly(isDebugging),
    toggleDebug,
    analyzeElement,
    findHighZIndex,
    checkConflicts
  }
}