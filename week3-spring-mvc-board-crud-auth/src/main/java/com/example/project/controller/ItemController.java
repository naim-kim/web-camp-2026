package com.example.project.controller;

import com.example.project.domain.Item;
import com.example.project.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/items")
public class ItemController {
    
    private final ItemService itemService;
    
    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }
    
    // List all items
    @GetMapping
    public String list(Model model) {
        model.addAttribute("items", itemService.getAllItems());
        return "list";
    }
    
    // Show item detail
    @GetMapping("/{id}")
    public String detail(@PathVariable Integer id, Model model) {
        model.addAttribute("item", itemService.getItemById(id));
        return "detail";
    }
    
    // Show create form
    @GetMapping("/create")
    public String createForm(Model model) {
        model.addAttribute("item", new Item());
        return "create";
    }
    
    // Process create
    @PostMapping("/create")
    public String create(@ModelAttribute Item item) {
        itemService.createItem(item);
        return "redirect:/items";
    }
    
    // Show update form
    @GetMapping("/{id}/update")
    public String updateForm(@PathVariable Integer id, Model model) {
        model.addAttribute("item", itemService.getItemById(id));
        return "update";
    }
    
    // Process update
    @PostMapping("/{id}/update")
    public String update(@PathVariable Integer id, @ModelAttribute Item item) {
        item.setId(id);
        itemService.updateItem(item);
        return "redirect:/items/" + id;
    }
    
    // Delete
    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Integer id) {
        itemService.deleteItem(id);
        return "redirect:/items";
    }
}
