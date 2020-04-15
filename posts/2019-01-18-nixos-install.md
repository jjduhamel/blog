---
title: Installing NixOS
author: John Duhamel
---

## Introduction

NixOS is a Linux distribution that can be fully configured using a functional configuration language called Nix. There are several advantages to this approach. NixOS stores a snapshot of the system each time you rebuild the configuration, making it easy to revert to a previous good state in case you brick your system.

Additionally, it’s easy to share configurations on multiple workstations, greatly reducing the burden of creating new hosts. For this reason, it’s convenient to experiment with new configurations using VirtualBox. When you feel ready, it’s reletively easy to port your configuration to your actual hardware making a small set of documented changes.

## Start NixOS

In this post I’m using VirtualBox as an installation platform. This should be sufficient to create a base image that I’ll be able to port to my primary desktop.

First, create a new virtaul machine and mount the ISO image.

<div style="text-align: center;">
  ![](/images/nixos-virtualbox.png){width=75%}
</div>

Now, boot into NixOS. If everything goes well, you should get to a root shell with network access. If you’re following along on a laptop and need to connect using wifi, run the nmtui utility to connect.

<div style="text-align: center;">
  ![](/images/nixos-shell.png){width=75%}
</div>

## Create Partitions

Next you’ll need to create some partitions. You’ll modify this when you port your config to other systems, so a single partition will work fine.

```bash
$ parted /dev/sda -- mklabel gpt
$ parted /dev/sda -- mkpart primary 1MiB 100%
$ mkfs.ext4 -L nixos /dev/sda1
```

<div style="text-align: center;">
  ![](/images/nixos-partitions.png){width=45%}
  ![](/images/nixos-filesystems.png){width=45%}
</div>

## Install NixOS

Now, mount your new filesystem and proceed with the installation. You’ll need to edit /mnt/etc/nixos/configuration.nix and add the following line:

```nix
  boot.loader.grub.device = "/dev/sda";
```

```bash
$ mount /dev/sda1 /mnt
$ nixos-generate-config --root /mnt
$ vim /mnt/etc/nixos/configuration.nix
  boot.loader.grub.device = "/dev/sda";
$ nixos-install
```

<div style="text-align: center;">
  ![](/images/nixos-mounts.png){width=45%}
  ![](/images/nixos-install.png){width=45%}
</div>

Now it’s time to reboot your system. If you did it correctly you’ll see a grub menu like this.

<div style="text-align: center;">
  ![](/images/nixos-grub.png){width=45%}
  ![](/images/nixos-revisions.png){width=45%}
</div>

## Install Vim

Once you reboot your system, you may notice that some tools are missing. The first obvious one that stuck out for me was that vim was not installed. In order to install it, add the following to your config:

*/etc/nixos/configuration.nix*

```nix
  environment.systemPackages = with pkgs; [
    vim
  ];

  environment.variables.EDITOR = "vim";
```

```bash
$ nixos-rebuild switch
```

## Add a User

**Note:**  We do this at the command line rather than my nix config.  This approach allows you to decouple system-dependent variables from your NixOS configuration.  Some users may prefer to hardcode these in the nix config.

```bash
$ useradd -m -G wheel <user>
$ passwd <user>
```

Also, you may wish to enable passwordless sudo.

*/etc/nixos/configuration.nix*

```nix
  security.sudo.enable = true;
  security.sudo.wheelNeedsPassword = false;
```

```bash
$ nixos-rebuild switch
```

## Conclusion

Now you have a very basic NixoS installation.  You may wish to read my [next post](/posts/2019-01-29-nixos-i3-setup.html) as well, where I set up i3 and install a few appications to make the install more usable.
