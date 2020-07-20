---
title: Setup i3 on NixOS
author: John Duhamel
---

## Introduction

In this post, we’ll configure i3 and install a few applications to build a minimal usable workflow. Specifically, we’ll install the following.

* Window Manager: i3
* Terminal: urxvt
* Browser: firefox
* Clipboard: clipmenu
* Keychain: gnome-keyring

## Enable i3

The first step is to install i3. To do this, uncomment the following in your nix configuration file.

*/etc/nixos/configuration.nix*

```bash
  services.xserver.enable = true;
  services.xserver.autorun = false;
  services.xserver.layout = "us";
  services.xserver.desktopManager.default = "none";
  services.xserver.desktopManager.xterm.enable = false;
  services.xserver.displayManager.lightdm.enable = true;
  services.xserver.windowManager.i3.enable = true;
```

Pay specific attention to `services.xserver.autorun = false`. If you dont’ have that in your config, then i3 will start automatically at boot. I find it’s more useful to manually start your display manager until you have your workspace fully configured. To start the display manager, run:

```bash
$ sudo systemctl start display-manager
```

When you first start the display manager, you’ll be prompted to login. Once you enter your password, you’ll get a basic i3 workspace with an instance of xterm.

<div style="text-align: center;">
  ![](/images/lightdm-splash.png){width=30%}
  ![](/images/i3-landing.png){width=30%}
  ![](/images/i3-xterms.png){width=30%}
</div>

Finally, generate a default config file by running the following command and following the prompts.

```bash
$ i3-config-wizard
```

Congratulations, you’ve installed i3!

<div style="text-align: center;">
  ![](/images/i3-welcome.png){width=75%}
</div>

## Modifier Key

**Note:** *This is likely configured correctly by default.*

First, you need to enable the correct Mod key for i3. By default, this should be either Mod1 or Mod4. Check for the following line in .config/i3/config.

*.config/i3/config*

```i3
  set $mod Mod4
```

In order to see what keycode that corresponds to, run:

```bash
$ nix-shell -p xorg.xmodmap "xmodmap -pm"
mod1    Alt_L (0x40) ...
mod4    Super_L (0x85) ...
```

Now, use `xev` to capture the keycodes. Confirm that you’re able to capture your modifier key.

```bash
$ nix-shell -p xorg.xev "xev -event keyboard"
```

<div style="text-align: center;">
  ![](/images/i3-keycodes.png){width=75%}
</div>

*Caveat:* I had a small hangup which was caused by virtualbox intercepting the Super_L key. In order to fix this, go to VirtualBox VM -> Preferences -> Input and change the Host Key Configuration to be Right ⌘.

## Terminal

My preferred terminal emulator is urxvt. By default, NixOS uses xterm. In order to change this, add the following to your configuration:

*/etc/nixos/configuration.nix*

```nix
  environment.systemPackages = with pkgs; [
    ...
    rxvt_unicode
  ];

  environment.variables.EDITOR = "urxvt";
```

```bash
$ nixos-rebuild switch
```

## Install Fonts

You’ll likely want to change the default font to something that looks a little nicer. I prefer to use Hermit, although Source Code Pro and Terminus are other options. In order to install these, run:

*/etc/nixos/configuration.nix*

```nix
  fonts.fonts = with pkgs; [
    hermit
    source-code-pro
    terminus_font
  ];
```

```bash
$ sudo nixos-rebuild switch
```

## Configure URxvt

Now, you’ll need to configure urxvt to use your desired font. While we’re at it, let’s change the background color to black and get rid of the ugly scrollbar.

*~/.Xresources*

```yaml
!###############
! Colors
!###############
*background: black
*foreground: white

!###############
! URxvt Settings
!###############
URxvt.font: xft:Hermit Light:size=8
URxvt.scrollBar: false
```

```bash
$ xrdb .Xresources
```

**Note:** The hermit font is in the unstable nixpkg repo. If you didn’t follow to previous terminal and are getting an “undefined variable” error, you likely need to run this:

```bash
$ nix-channel --add https://nixos.org/channels/nixpkgs-unstable
$ nix-channel --update
$ nixos-rebuild switch --upgrade
```

## Browser

The process for installing firefox is fairly straight forward. Simply add the following to your NixOS configuration:

*/etc/nixos/configuration.nix*

```
  environment.systemPackages = with pkgs; [
    ...
    firefox
  ];
```

## Clipboard

I like to use clipmenu as a clipboard manager. To install clipmenu, add the following to your NixOS config:

*/etc/nixos/configuration.nix*

```nix
  environment.systemPackages = with pkgs; [
    ...
    clipmenu
  ];
```

Now, you’ll want to bind some hotkeys in order to use it. Add the following to your i3 config:

*~/.config/i3/config*

```
bindsym $mod+c exec "CM_ONESHOT=1 clipmenud"
bindsym $mod+v exec clipmenu
```

Now, when you press `<Mod>-v`, you’ll see a menu at the top of your screen showing your current clipboard. You can cycle through the entries and press enter to add that to the x11 clipboard. Once that’s loaded, you can paste it by pressing `<Ctrl>-v`.

**Caveat:** urxvt uses `<Ctrl>-<Alt>-`c and `<Ctrl>-<Alt>-v` for copy paste. This is necessary since many cli applications bind to `<Ctrl>-c` and `<Ctrl>-v`.

## Keychain

You’ll want to setup a keychain. This provides an extra layer of security for sensitive data like passwords and pgp keys. Your data is encrypted at-rest, and unlocked when you enter your password during boot.

*/etc/nixos/configuration.nix*

```nix
  services.gnome3.gnome-keyring.enable = true;
  services.gnome3.seahorse.enable = true;
  
  security.pam.services.lightdm.enable = true;
```

For these changes to take effect, you’ll need to reboot your computer (be sure to nixos-rebuild switch first). Once you do that, open seahorse and create a new Password Keyring called `login`. Be sure to use the same password that you use to login.

## Conclusion

You now have a very basic i3 setup which should be suitable as a base for more abitious projects.

<div style="text-align: center;">
  ![](/images/i3-urxvt.png){width=75%}
</div>
