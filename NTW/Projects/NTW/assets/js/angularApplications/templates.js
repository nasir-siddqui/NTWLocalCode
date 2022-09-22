define(["angular"], function(angular) {

angular.module('templates-main', ['/resources/templating-kit/themes/mybusiness/js/angularApplications/accessListTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/accessTreeTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/combineRolesTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/companyContactsTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/customTableTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfFieldTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfFieldsTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfShareDialogTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfSummaryFieldsTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/manageCustomTableTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupBatchTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupCollectTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupMainTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupOrganisationsTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupSearchTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/manageInviteTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/manageUserHomeTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/manageUserSummaryTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/organizationSearchTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/savedOrganizationsTemplate.html', '/resources/templating-kit/themes/mybusiness/js/angularApplications/summaryTemplate.html']);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/accessListTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/accessListTemplate.html",
    "<div class=\"tsAccess\">\n" +
    "    <div ng-if=\"puiStructure === null\" class=\"tsWrapInner\">\n" +
    "        <div class='tscLoading--Full'><div class='tsLoading-icon-large'></div></div>\n" +
    "    </div>\n" +
    "    <ul class=\"tsAccess-columnContainer\">\n" +
    "        <li class=\"tsColumn-list-4\" ng-repeat=\"item in puiStructure\">\n" +
    "            <h3 class=\"h4 tsAccess-headline\">{{ item.displayName }}</h3>\n" +
    "            <ul class=\"tsAccess-list\">\n" +
    "                <li class=\"tsAccess-listItem\" ng-repeat=\"item2 in item.items | orderBy:'displayName'\">                    \n" +
    "                    <div ng-if=\"item2.displayName\" class=\"tseRadioBox--CheckButton--ColorNavigation tsPullLeft\" ng-class=\"{ semichecked: isSemichecked(item2), readOnly: readOnly, checked: readOnly && item2.$selected }\">\n" +
    "                        <input type=\"checkbox\" id=\"{{ item2.key }}\" ng-change=\"checkStatusChanged(item2)\" ng-model=\"item2.$selected\" ng-disabled=\"readOnly\">\n" +
    "                        <label for=\"{{ item2.key }}\">{{ item2.displayName }}</label>\n" +
    "                        <span ng-if=\"item2.items\" class=\"label\">{{ checkStatus(item2) }}</span>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/accessTreeTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/accessTreeTemplate.html",
    "<div>\n" +
    "    <div ng-if=\"puiStructure === null\" class=\"tsWrapInner\">\n" +
    "        <div class='tscLoading--Full'><div class='tsLoading-icon-large'></div></div>\n" +
    "    </div>\n" +
    "    <div class=\"tsConfigure tsPageSection\" ts-showmore data-target=\"> ul\" data-height=\"110\" data-showmore=\"Visa mer\" ng-if=\"puiStructure !== null\">\n" +
    "\n" +
    "        <ul class=\"tsAccordion-list\">\n" +
    "            <li class=\"tsAccordion-list-item tsAccordion-configContainer\" ng-repeat=\"item in puiStructure\">\n" +
    "                <div class=\"tsPageSection-heading\" ng-class=\"{ blueAlt: readOnly }\">\n" +
    "                    <div class=\"tseRadioBox--CheckButton--ColorNavInverted tsWrapInner\" ng-class=\"{ semichecked: isSemichecked(item), readOnly: readOnly }\">\n" +
    "                        <input type=\"checkbox\" id=\"{{ item.name }}\" ng-change=\"checkStatusChanged(item)\" ng-model=\"item.$selected\" ng-disabled=\"readOnly\">\n" +
    "                        <label class=\"h2 tsPageSection-headingLabel\" for=\"{{ item.name }}\">{{ item.displayName }}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <ul class=\"tsAccordion-list tsAccordion-list--striped tsWrapInner\" style=\"display: block;\">\n" +
    "                    <li class=\"tsAccordion-list-item\" ng-repeat=\"item2 in item.items | orderBy:'displayName'\" ts-animate-toggle=\"toggleAccordion\">\n" +
    "                        <div ng-if=\"item2.displayName\" class=\"col-xs-12\">\n" +
    "                            <div class=\"tseRadioBox--CheckButton--ColorNavigation tsAccordion-label\" ng-class=\"{ semichecked: isSemichecked(item2), readOnly: readOnly }\">\n" +
    "                                <input type=\"checkbox\" id=\"{{ item2.name }}\" ng-change=\"checkStatusChanged(item2)\" ng-model=\"item2.$selected\" ng-disabled=\"readOnly\">\n" +
    "                                <label class=\"h4 tsPullLeft empty\" for=\"{{ item2.name }}\"></label>\n" +
    "                                <h4 class=\"h4 tsPullLeft\">{{ item2.displayName }}</h4>\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"item2.items\" class=\"tsAccordion-show-more\"><i ng-hide=\"toggleAccordion\" class=\"tsIcon-ArrowDown arrowDown showArrow\"></i><i ng-show=\"toggleAccordion\" class=\"tsIcon-ArrowUp arrowUp showArrow\"></i></div>\n" +
    "                        </div>\n" +
    "                        <ul ng-if=\"item2.items\" class=\"tsAccordion-alt-list\" ts-animate=\"toggleAccordion\">\n" +
    "                            <li class=\"tsAccordion-list-item tsAccordion-alt-list-item\" ng-repeat=\"item3 in item2.items | orderBy:'displayName'\">\n" +
    "                                <div ng-if=\"item3.displayName\" class=\"tseRadioBox--CheckButton--ColorNavigation tsAccordion-label\" ng-class=\"{ readOnly: readOnly }\">\n" +
    "                                    <input type=\"checkbox\" id=\"{{ item3.name }}\" ng-change=\"checkStatusChanged(item3)\" ng-model=\"item3.$selected\" ng-disabled=\"readOnly\">\n" +
    "                                    <label class=\"h4 tsPullLeft empty\" for=\"{{ item3.name }}\"></label>\n" +
    "                                    <h4 class=\"h4 tsPullLeft\">{{ item3.displayName }}</h4>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/combineRolesTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/combineRolesTemplate.html",
    "<div ng-show=\"visible\">\n" +
    "    <div ng-if=\"allRoles === null\" class='tscLoading--Full'><div class='tsLoading-icon-large'></div></div>\n" +
    "    <div ng-if=\"allRoles !== null\" class=\"tsShortCuts-container tsShortCuts--inverted\">\n" +
    "        <h2 class=\"h2 inline inverted\">{{headerText}}</h2>\n" +
    "        <a class=\"tsShortCuts-manage tsToggleDropdown\" ng-click=\"toggleManage()\" ng-show=\"manageEnabled\"><span ng-show=\"!manage\">{{ manageText }}</span><span ng-show=\"manage\">{{ closeText }}</span><i class=\"tsIcon-Configure\"></i></a>\n" +
    "        <ul class=\"tsShortCuts-links\">\n" +
    "            <li ng-repeat=\"role in combinedRoles | orderBy:'displayName'\">\n" +
    "                <span class=\"tsBookmark-item\">{{role.roleName}}<i ng-show=\"!role.$disabled\" class=\"tsIcon-Minus tsHandleShortCut-icon\" ng-click=\"toggleRole(role)\"></i><span ng-if=\"role.systemRole\" class=\"tscLabel\" style=\"float: none; top: 0;\">Systemroll</span></span>\n" +
    "            </li>\n" +
    "            <li id=\"toggle-add\" class=\"tsShortCuts-add-link pin\" ng-show=\"manage || !manageEnabled\" ng-click=\"toggleAdd()\">\n" +
    "                <span>{{addText}}<i class=\"tsIcon-Add\"></i></span>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <div class=\"tsShortCuts-arrow-up tsShortCuts-hide\"></div>\n" +
    "    </div>\n" +
    "    <ul class=\"tsAccordion-list tsAccordion-list--striped tsShortCuts-list tsHidden\" ts-animate=\"addActive && (manage || !manageEnabled)\" data-animate-type=\"slide\" data-animate-duration=\"300\">\n" +
    "        <li class=\"tsAccordion-list-item\" ng-repeat=\"role in allRoles | orderBy:'displayName'\" ng-click=\"toggleRole(role)\">\n" +
    "            <h2 class=\"h4\">{{role.roleName}}</h2><span ng-if=\"role.systemRole\" class=\"tscLabel\">Systemroll</span><i ng-show=\"!role.$selected && !role.$disabled\" class=\"tsIcon-Add tsShortCuts-add-btn\"></i><i ng-show=\"role.$selected && !role.$disabled\" class=\"tsIcon-Minus tsShortCuts-add-btn\"></i>\n" +
    "        </li>\n" +
    "        <li ng-if=\"allRoles === null\" class=\"tsAccordion-list-item\">\n" +
    "            <div class='tscLoading'><div class='tsLoading-icon-large'></div></div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/companyContactsTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/companyContactsTemplate.html",
    "<div ng-if=\"visible\">\n" +
    "    <div ng-if=\"loading\">\n" +
    "        <div class=\"tscLoading--Full--PaddingHalfGutter\"><div class=\"tsLoading-icon-large\"></div></div>\n" +
    "    </div>\n" +
    "    <h2 class=\"h2 tsList-header\" ng-if=\"!loading\">{{ headline }}</h2>\n" +
    "    <ul class=\"tsList\" ng-if=\"!loading\">\n" +
    "        <li class=\"tsList-item tsColumn-list-4\" ng-repeat=\"contact in contacts\">\n" +
    "            <h4 class=\"h3 tsList-itemHeader\">{{ contact.n }}</h4>\n" +
    "            <ul class=\"tsList--alt\">\n" +
    "                <li class=\"tsList--alt-item\" ng-if=\"contact.e\"><a href=\"mailto:{{ contact.e }}\"><i class=\"tsIcon-Mail\"></i>{{ contact.e }}</a></li>\n" +
    "                <li class=\"tsList--alt-item\" ng-if=\"contact.p\"><a href=\"tel:{{ contact.p }}\"><i class=\"tsIcon-Telephone\"></i>{{ contact.p }}</a></li>\n" +
    "            </ul>\n" +
    "            \n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/customTableTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/customTableTemplate.html",
    "<div ts-cloak ng-cloak class=\"ng-cloak\">\n" +
    "    <div class=\"tsCollapse-button-wrapper\">\n" +
    "        <button class=\"tsCollapse-trigger tsTable-toggle-button\">\n" +
    "            <i class=\"tsIcon-Menu\" ng-click=\"showMenu = !showMenu\"></i>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"tsTable-menu tsTable-menu-select\" ng-class=\"{tsHidden: !showMenu}\">\n" +
    "        <div class=\"tsTable-menu-inner\">\n" +
    "            <div ng-if=\"customization.search.enabled\" class=\"tseTextField--Normal tsTable-datatable-search\">\n" +
    "                <input type=\"text\" ng-model=\"filter.$\" placeholder=\"{{customization.search.placeholderText}}\"><i class=\"tsIcon-Search\"></i>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-show=\"customization.dropdown.enabled\" class=\"tseSelect--Normal--Narrow--Inline\">\n" +
    "                <select ts-select ng-model=\"customization.dropdown.value\" ng-change=\"dropdownChange()\" ng-options=\"item.value as item.label for item in customization.dropdown.options\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-show=\"customization.hardFilter.enabled\" class=\"tsTable-datatable-filterTabs\">\n" +
    "                <div class=\"tseRadioBox--Normal--Button--ColorNavigation--InlineSmall\" ng-repeat=\"filterValue in customization.hardFilter.values\">\n" +
    "                    <input id=\"hardFilter{{$index}}\" type=\"radio\" ng-model=\"$parent.selectedHardFilter\" value=\"{{filterValue.value}}\">\n" +
    "                    <label class=\"ng-binding\" for=\"hardFilter{{$index}}\" isSelected=\"{{$parent.selectedHardFilter == filterValue.value }}\">{{filterValue.name}}</label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div style=\"clear: both;\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"tsTable-datatable-wrapper\" ng-class=\"{ 'tsTable-carousel': customization.carousel.enabled }\" role=\"grid\">\n" +
    "        <div ng-if=\"customization.multipleSelection.enabled\" ts-animate=\"multipleSelection.active\"\n" +
    "             class=\"tsAttention--Info\" ts-full-container>\n" +
    "            <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "                <i class=\"tsIcon-Information\"></i>\n" +
    "                <p>\n" +
    "                    <span>\n" +
    "                        {{customization.openLink.batchInfoText}}\n" +
    "                    </span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"customization.columnFilter.enabled\" ts-animate=\"columnFilter.active && columnFilter.informationText !== undefined\"\n" +
    "             class=\"tsAttention--Info\" ts-full-container>\n" +
    "            <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "                <i class=\"tsIcon-Information\"></i>\n" +
    "                <p>\n" +
    "                    <span>\n" +
    "                        {{columnFilter.informationText}}\n" +
    "                    </span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ts-animate=\"customization.initialInformationTemplate && !initialInformationSeen\"\n" +
    "             class=\"tsAttention--Info\" ts-full-container>\n" +
    "            <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "                <i class=\"tsIcon-Information\"></i>\n" +
    "                <p>\n" +
    "                    <span ng-include=\"'templates/initialInformation.html'\"></span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"tsTable-wrapper\">\n" +
    "            <form method=\"POST\" action=\"{{customization.openLink.batchUrl}}\" class=\"{{customization.formClass}}\">\n" +
    "                <div ts-animate=\"multipleSelection.active\" class=\"tscArea--Center\">\n" +
    "                    <button class=\"tsBtn--Normal--Regular\" type=\"submit\" ng-click=\"openBatch()\">{{customization.openLink.batchText}}</button>\n" +
    "                </div>\n" +
    "                <div ng-if=\"isLoading\" class='tscLoading--Full'><div class='tsLoading-icon-large'></div></div>\n" +
    "                <div ng-hide=\"isLoading\" ng-if=\"customization.columnFilter.enabled\" class=\"tsListFilter-collapse\">\n" +
    "                    <div class=\"tsListFilter-trigger\">\n" +
    "                            <a data-widget-control=\"collapse-trigger\" ng-class=\"{'active' : columnFilter.active}\" ng-click=\"toggleColumnFiltering()\" data-toggle=\"collapse\" data-target=\".tsListFilter-outer\"><span>{{customization.columnFilter.editColumnsText}}</span> <i class=\"tsIcon-Filter\"></i></a>\n" +
    "                    </div>\n" +
    "                    <div class=\"tsListFilter-outer\" ts-animate=\"columnFilter.active\">\n" +
    "                        <div class=\"tsListFilter tsWrapInner tsPaddingTop tsPaddingBottom\">\n" +
    "                            <ul class=\"tscList--Inline--SpaceHalf\">\n" +
    "                                <li ng-repeat=\"c in customization.dataDefinitions.columns\">\n" +
    "                                    <a class=\"tsBtn--Light\" ng-class=\"{ '--Inverted': c.displayed }\" ng-click=\"toggleColumn(c)\">{{c.name}}<i ng-show=\"c.displayed === true\" class=\"tsIcon-Close\"></i></a>   \n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                            <div class=\"tscInline--Middle--GutterHalf tsMarginTop\">\n" +
    "                                <a class=\"tsSecondaryLink\" ng-click=\"cancelColumnFiltering()\">{{customization.columnFilter.cancelText}}</a>\n" +
    "                                <button ts-loading-button type=\"button\" ng-click=\"saveColumnFiltering()\" class=\"tsBtn--Internal--Normal--Regular--Animated\"\n" +
    "                                x-progress-text=\"{{customization.columnFilter.saveProgressText}}\"\n" +
    "                                x-status=\"columnFilter.status\"\n" +
    "                                x-click-enabled=\"false\"\n" +
    "                                x-finish-text=\"{{customization.columnFilter.saveFinishedText}}\"\n" +
    "                                x-failure-text=\"{{customization.columnFilter.saveFailedText}}\"\n" +
    "                                >{{customization.columnFilter.saveText}}</button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <div class=\"tsTable-inner\" ng-class=\"{ 'tsTable-carousel-fixed': carousel.active && customization.multipleSelection.enabled }\">\n" +
    "\n" +
    "                    <div class=\"tsTable-inner-wrapper\">\n" +
    "                        <table ng-hide=\"isLoading\" ng-table=\"tableParams\" class=\"tsTable tsTable-horizontal tsTable-datatable tsTable-hiddenRows ng-table-rowselected ng-table\" template-pagination=\"custom/pager\" ts-custom-table-inner>\n" +
    "                            <thead>\n" +
    "                                <tr>\n" +
    "                                    <th ng-if=\"customization.multipleSelection.enabled\" ng-class=\"{ 'fixed': carousel.active }\" width=\"40\">\n" +
    "                                        <div class=\"tseRadioBox--CheckButton--ColorNavigation\" ng-class=\"{semichecked : multipleSelection.isSemiChecked}\">\n" +
    "                                            <input type=\"checkbox\" id=\"multipleSelectionActive\" ng-model=\"multipleSelection.active\" ng-change=\"setAllCheckboxes()\">\n" +
    "                                            <label for=\"multipleSelectionActive\"></label>\n" +
    "                                        </div>\n" +
    "                                    </th>\n" +
    "                                    <th ng-repeat=\"c in customization.dataDefinitions.columns | filter: { displayed:true }\" ng-click=\"setSortColumn(c)\">\n" +
    "                                        {{c.name}} <i ng-if=\"isSortedOn(c)\" ng-class=\"getSortClass(c)\"></i>\n" +
    "                                    </th>\n" +
    "                                    <th ng-if=\"customization.rowDetails.enabled\">{{customization.rowDetails.headerText}}</th>\n" +
    "                                </tr>\n" +
    "                            </thead>\n" +
    "                            <tbody>\n" +
    "                                <tr ng-repeat-start=\"p in $data\" id=\"tr{{getIdentity(p)}}\" ng-class-odd=\"'odd'\" ng-class-even=\"'even'\" ng-class=\"{'tsTable-linkedRow': customization.openLink.enabled && !p.$openLinkDisabled}\" ts-table-row>\n" +
    "                                    <td ng-if=\"customization.multipleSelection.enabled\" class=\"tsTable-checkbox\" width=\"40\" ng-class=\"{ 'fixed': carousel.active }\">\n" +
    "                                        <div class=\"tseRadioBox--CheckButton--ColorNavigation\">\n" +
    "                                            <input type=\"checkbox\" id=\"multipleSelection{{getIdentity(p)}}\" ng-model=\"p.$selected\" ng-change=\"onCheckedEvent()\">\n" +
    "                                            <label for=\"multipleSelection{{getIdentity(p)}}\"></label>\n" +
    "                                        </div>\n" +
    "                                    </td>\n" +
    "                                    <td ng-repeat=\"c in customization.dataDefinitions.columns | filter: { displayed:true }\" data-title=\"'{{c.name}}'\" sortable=\"'{{c.fieldName}}'\" ng-click=\"openLink(p)\" data-label=\"{{c.name}}\">\n" +
    "                                        <span>\n" +
    "                                            <div ng-include=\"'templates/columnDetails' + $index + '.html'\" ts-table-template></div>\n" +
    "                                        </span>\n" +
    "                                    </td>\n" +
    "                        \n" +
    "                                    <td ng-class=\"{centeredButton: !$eval(customization.rowDetails.buttonDisabledExpression) }\" ng-if=\"customization.rowDetails.enabled\">\n" +
    "                                        <span ng-if=\"$eval(customization.rowDetails.buttonDisabledExpression)\" class=\"grey\">{{customization.rowDetails.buttonDisabledText}}</span>\n" +
    "                                        <a ng-if=\"!$eval(customization.rowDetails.buttonDisabledExpression) && (!customization.api.deleteRowAfterAction || customization.rowDelete.enabled)\" class=\"tsBtn--Normal--Internal--Regular\" id=\"displayRowDetails{{getIdentity(p)}}\" ng-click=\"displayRowDetails(p)\" href=\"\">{{getDetailsButtonText(p)}}<i ng-if=\"expandedRowId!==getIdentity(p)\" class=\"tsIcon-ArrowDown\"></i><i ng-if=\"expandedRowId===getIdentity(p)\" class=\"tsIcon-ArrowUp\"></i></a>\n" +
    "                                        <a ng-if=\"!$eval(customization.rowDetails.buttonDisabledExpression) && customization.api.deleteRowAfterAction && !customization.rowDelete.enabled && !p.$rowDetailsButtonDisabled\" class=\"tsBtn--Delete\" id=\"displayRowDetails{{getIdentity(p)}}\" ng-click=\"displayRowDetails(p)\"></a> \n" +
    "                                    </td>\n" +
    "                                    <td ng-if=\"customization.rowDelete.enabled\">\n" +
    "                                        <span ng-if=\"$eval(customization.rowDelete.buttonDisabledExpression)\" class=\"grey\">{{customization.rowDelete.buttonDisabledText}}</span>\n" +
    "                                        <a ng-if=\"!$eval(customization.rowDelete.buttonDisabledExpression)\" class=\"tsBtn--Delete\" id=\"displayRowDetails{{getIdentity(p)}}\" ng-click=\"displayRowDelete(p)\"></a>\n" +
    "                                    </td>\n" +
    "                                </tr>\n" +
    "                                <tr ng-repeat-end=\"\" ng-if=\"expandedRowId === getIdentity(p) || expandedRowDeleteId === getIdentity(p)\">\n" +
    "                                    <td class=\"tsTable-hiddenContainer\" colspan=\"{{(customization.dataDefinitions.columns | filter: {displayed:true}).length + 2}}\">\n" +
    "                                        <div ng-if=\"!p.$details && !p.$deleteData\">\n" +
    "                                            <div class='tscLoading--Full'><div class='tsLoading-icon-large'></div></div>\n" +
    "                                        </div>\n" +
    "                                        <div ng-if=\"p.$details && expandedRowId === getIdentity(p)\" class=\"tsComponent--inset tsClear\" ts-full-container>\n" +
    "                                            <div ng-if=\"customization.rowDetails.breakFree\" ng-include=\"'templates/rowDetails.html'\"></div>\n" +
    "                                            <div ng-if=\"!customization.rowDetails.breakFree\" class=\"tsWrapInner\">\n" +
    "                                                <div class=\"tsPaddingLeft tsPaddingBottom tsPaddingTop\">\n" +
    "                                                    <div ng-include=\"'templates/rowDetails.html'\"></div>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <div ng-if=\"p.$deleteData && expandedRowDeleteId === getIdentity(p)\" class=\"tsComponent--inset tsClear\" ts-full-container>\n" +
    "                                            <div ng-if=\"customization.rowDelete.breakFree\" ng-include=\"'templates/rowDelete.html'\"></div>\n" +
    "                                            <div ng-if=\"!customization.rowDelete.breakFree\" class=\"tsWrapInner\">\n" +
    "                                                <div class=\"tsPaddingLeft tsPaddingBottom tsPaddingTop\">\n" +
    "                                                    <div ng-include=\"'templates/rowDelete.html'\"></div>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </td>\n" +
    "                                </tr>\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"tsTable-carosuel-link-wrapper\" ng-if=\"carousel.active\">\n" +
    "                        <div ng-if=\"carousel.page > 0\" class=\"tsTable-carousel-link tsTable-carousel-link-prev\">  \n" +
    "                            <div class=\"tsTable-carousel-link-outer\">\n" +
    "                                <div class=\"tsTable-carousel-link-inner\">\n" +
    "                                    <a href ng-click=\"setPage(carousel.page - 1)\" class=\"fallback\"><i class=\"tsIcon-Previous\"></i></a>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"carousel.page < carousel.total - 1\" class=\"tsTable-carousel-link tsTable-carousel-link-next\">\n" +
    "                            <div class=\"tsTable-carousel-link-outer\">\n" +
    "                                <div class=\"tsTable-carousel-link-inner\">\n" +
    "                                    <a href ng-click=\"setPage(carousel.page + 1)\" class=\"fallback\"><i class=\"tsIcon-Next\"></i></a>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"tsTable-datatable-bottom\">\n" +
    "                    <div ts-animate=\"multipleSelection.active\" class=\"tscArea--Center\">\n" +
    "                        <button class=\"tsBtn--Normal--Regular\" type=\"submit\" ng-click=\"openBatch()\">{{customization.openLink.batchText}}</button>\n" +
    "                    </div>\n" +
    "                    <div class=\"dataTables_paginate paging_tsPagination tsPaging\">\n" +
    "                        <ul class=\"tsPaging-list\">\n" +
    "                            <li ng-switch=\"page.type\" ng-repeat=\"page in pages\" ng-class=\"{'selected': !page.active, 'tsPaging-list-item': page.type!='prev' && page.type!='next'}\">\n" +
    "                                <a href=\"\" ng-click=\"tableParams.page(page.number)\" ng-switch-when=\"prev\" class=\"tsPaging-arrow-prev\"><i class=\"tsPaging-icon tsIcon-Previous\"></i></a>\n" +
    "                                <a href=\"\" ng-click=\"tableParams.page(page.number)\" ng-switch-when=\"first\"><span ng-bind=\"page.number\"></span></a>\n" +
    "                                <a href=\"\" ng-click=\"tableParams.page(page.number)\" ng-switch-when=\"page\"><span ng-bind=\"page.number\"></span></a>\n" +
    "                                <a href=\"\" ng-click=\"tableParams.page(page.number)\" ng-switch-when=\"more\">...</a>\n" +
    "                                <a href=\"\" ng-click=\"tableParams.page(page.number)\" ng-switch-when=\"last\"><span ng-bind=\"page.number\"></span></a>\n" +
    "                                <a href=\"\" ng-click=\"tableParams.page(page.number)\" ng-switch-when=\"next\" class=\"tsPaging-arrow-next\"><i class=\"tsPaging-icon tsIcon-Next\"></i></a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <input type=\"hidden\" name=\"{{customization.dataDefinitions.identityFieldName}}\" value=\"{{openBatchPostData}}\" />\n" +
    "            </form>\n" +
    "\n" +
    "            <!--<script type=\"text/ng-template\" id=\"custom/pager\">\n" +
    "                <div class=\"tsTable-datatable-bottom\">\n" +
    "                    <div ts-animate=\"multipleSelection.active\" class=\"tscArea--Center\">\n" +
    "                        <button class=\"tsBtn--Normal--Regular\" type=\"submit\" ng-click=\"openBatch()\">{{customization.openLink.batchText}}</button>\n" +
    "                    </div>\n" +
    "                    <div class=\"dataTables_paginate paging_tsPagination tsPaging\">\n" +
    "                        <ul class=\"tsPaging-list\">\n" +
    "                            <li ng-switch=\"page.type\" ng-repeat=\"page in pages\" ng-class=\"{'selected': !page.active, 'tsPaging-list-item': page.type!='prev' && page.type!='next'}\">\n" +
    "                                <a href=\"\" ng-click=\"params.page(page.number)\" ng-switch-when=\"prev\" class=\"tsPaging-arrow-prev\"><i class=\"tsPaging-icon tsIcon-Previous\"></i></a>\n" +
    "                                <a href=\"\" ng-click=\"params.page(page.number)\" ng-switch-when=\"first\"><span ng-bind=\"page.number\"></span></a>\n" +
    "                                <a href=\"\" ng-click=\"params.page(page.number)\" ng-switch-when=\"page\"><span ng-bind=\"page.number\"></span></a>\n" +
    "                                <a href=\"\" ng-click=\"params.page(page.number)\" ng-switch-when=\"more\">...</a>\n" +
    "                                <a href=\"\" ng-click=\"params.page(page.number)\" ng-switch-when=\"last\"><span ng-bind=\"page.number\"></span></a>\n" +
    "                                <a href=\"\" ng-click=\"params.page(page.number)\" ng-switch-when=\"next\" class=\"tsPaging-arrow-next\"><i class=\"tsPaging-icon tsIcon-Next\"></i></a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </script>-->\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfFieldTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfFieldTemplate.html",
    "<h4 class=\"h4 title\" ng-if=\"field.type === 'label'\">{{ model.attributeValue }}</h4>\n" +
    "\n" +
    "<div ng-if=\"field.type === 'radio'\">\n" +
    "    <label class=\"field-label\" ng-class=\"{'strong':field.strongLabel}\" ng-if=\"section\" ng-hide=\"field.hideLabel\">{{ field.title }}</label>\n" +
    "    <div data-rules=\"{{ field.rules }}\" data-name=\"{{ field.id }}\" data-type=\"radio\" data-title=\"{{ field.name }}\">\n" +
    "        <div class=\"tseRadioBox--Normal{{ field.opt.style }}{{ $last ? '--Inline' : '--InlineSmall' }}\" ng-repeat=\"item in field.opt.options\">\n" +
    "            <input type=\"radio\" name=\"{{ field.id }}\" id=\"{{ field.id }}-{{ item.value }}\" value=\"{{ item.value }}\" ng-model=\"model.attributeValue\">\n" +
    "            <label for=\"{{ field.id }}-{{ item.value }}\" ng-bind-html=\"getHtml(item.label)\"></label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"field.type === 'checkbox'\">\n" +
    "    <label class=\"field-label inline\" ng-class=\"{'strong':field.strongLabel}\" ng-if=\"section\" ng-hide=\"field.hideLabel\">{{ field.title }}</label>\n" +
    "    <div class=\"tseRadioBox--Normal--ColorNavigation{{ field.opt.style }}--Inline\">\n" +
    "        <input type=\"checkbox\" name=\"{{ field.id }}\" id=\"{{ field.id }}\" value=\"true\" ng-true-value=\"{{ field.opt.checked }}\" ng-false-value=\"{{ field.opt.unchecked }}\" ng-model=\"model.attributeValue\" data-rules=\"{{ field.rules }}\" data-title=\"{{ field.name }}\">\n" +
    "        <label for=\"{{ field.id }}\" data-checked=\"{{ field.opt.checked }}\">{{ field.opt.unchecked }}</label>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"field.type === 'radiospot'\">\n" +
    "    <div data-rules=\"{{ field.rules }}\" data-name=\"{{ field.id }}\" data-type=\"radio\" data-title=\"{{ field.name }}\">\n" +
    "        <div class=\"tseRadioBox--Normal--Spot--Inline\" ng-if=\"field.single\" ng-repeat=\"item in field.single\">\n" +
    "            <input type=\"radio\" name=\"{{ field.id }}\" id=\"{{ field.id }}-{{ item.value }}\" value=\"{{ item.value }}\" ng-model=\"model.attributeValue\">\n" +
    "            <label for=\"{{ field.id }}-{{ item.value }}\">\n" +
    "                <h4>{{ item.label }}</h4>\n" +
    "                <span>{{ item.unit }}</span>\n" +
    "                <p ng-if=\"item.price\">{{ item.price }}</p>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"group\" ng-if=\"field.groups\" ng-repeat=\"group in field.groups\">\n" +
    "            <label>{{ group.title }}</label>\n" +
    "            <div class=\"tseRadioBox--Normal--Spot--Inline\" ng-repeat=\"item in group.options\">\n" +
    "                <input type=\"radio\" name=\"{{ field.id }}\" id=\"{{ field.id }}-{{ item.value }}\"value=\"{{ item.value }}\" ng-model=\"model.attributeValue\">\n" +
    "                <label for=\"{{ field.id }}-{{ item.value }}\">\n" +
    "                    <h4>{{ item.label }}</h4>\n" +
    "                    <span>{{ item.unit }}</span>\n" +
    "                    <p ng-if=\"item.price\">{{ item.price }}</p>\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"tseRadioBox--Normal--Spot\" ng-if=\"field.type === 'checkboxspot'\">\n" +
    "    <input type=\"checkbox\" name=\"{{ field.id }}\" id=\"{{ field.id }}\" value=\"true\" ng-true-value=\"{{ field.opt.value }}\" ng-false-value=\"\" ng-model=\"model.attributeValue\" data-rules=\"{{ field.rules }}\" data-title=\"{{ field.name }}\">\n" +
    "    <label for=\"{{ field.id }}\">\n" +
    "        <h4>{{ field.opt.label }}</h4>\n" +
    "        <span>{{ field.opt.unit }}</span>\n" +
    "        <p ng-if=\"field.opt.price\">{{ field.opt.price }}</p>\n" +
    "    </label>\n" +
    "</div>\n" +
    "        \n" +
    "<div class=\"tseTextField--Normal{{ field.opt.width }}{{ field.opt.width ? '--Inline' : '' }}\" ng-if=\"field.type === 'text'\">\n" +
    "    <label ng-class=\"{ 'field-label': section }\" ng-if=\"section\" ng-hide=\"field.hideLabel\" for=\"{{ field.id }}\">{{ field.title }} {{ field.required ? '*' : '' }}</label>\n" +
    "    <input type=\"text\" name=\"{{ field.id }}\" id=\"{{ field.id }}\" ng-model=\"model.attributeValue\" data-rules=\"{{ field.rules }}\" data-title=\"{{ field.name }}\" placeholder=\"{{ field.description }}\">\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"field.type === 'select'\">\n" +
    "    <label class=\"field-label\" ng-if=\"section\">{{ field.title }}</label>\n" +
    "    <div class=\"tseSelect--Normal{{ field.opt.width }}\">\n" +
    "        <select name=\"{{ field.id }}\" id=\"{{ field.id }}\" ng-model=\"model.attributeValue\" data-rules=\"{{ field.rules }}\" data-title=\"{{ field.name }}\" data-select-value=\"{{ model.attributeValue }}\" ng-options=\"item.value as item.label for item in field.opt.options\">\n" +
    "            <!--<option ng-repeat=\"item in field.opt.options\" value=\"{{ item.value }}\" ng-selected=\"item.value === model.attributeValue\">{{ item.label }}</option>-->\n" +
    "        </select>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"tseTextArea\" ng-if=\"field.type === 'textarea'\">\n" +
    "    <label ng-hide=\"field.hideLabel\" for=\"{{ field.id }}\" ng-if=\"section\">{{ field.title }} {{ field.required ? '*' : '' }}</label>\n" +
    "    <textarea name=\"{{ field.id }}\" id=\"{{ field.id }}\" rows=\"{{ field.opt.rows }}\" ng-model=\"model.attributeValue\" data-rules=\"{{ field.rules }}\" data-title=\"{{ field.name }}\"></textarea>\n" +
    "</div>\n" +
    "\n" +
    "<a ng-if=\"field.type === 'link'\" href=\"{{ field.opt.url }}\"><i class=\"{{ field.opt.icon }}\"></i> {{ field.opt.title }}</a>\n" +
    "");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfFieldsTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfFieldsTemplate.html",
    "<!-- Need a wrapper here for compile purpse. The wrapper will be removed in the wrapper directive link function -->\n" +
    "<div ts-dcf-fields-wrapper>\n" +
    "\n" +
    "    <h4 ng-repeat-start=\"field in fields\" class=\"h4 title\" ng-if=\"field.type === 'label'\" ng-show=\"show({field:field})\">{{ model.attributes[field.index].attributeValue }}</h4>\n" +
    "\n" +
    "    <fieldset class=\"tscFormSection--Sub--Inline\" ng-if=\"field.type === 'radio'\" ng-show=\"show({field:field})\">\n" +
    "        <legend>{{ field.title }}</legend>\n" +
    "        <div class=\"tscFormSection-inner\">\n" +
    "            <div class=\"tseRadioBox--Normal{{ field.opt.style }}{{ $last ? '--Inline' : '--InlineSmall' }}\" ng-repeat=\"item in field.opt.options\">\n" +
    "                <input type=\"radio\" name=\"{{ field.id }}\" id=\"{{ field.id }}-{{ item.value }}\" value=\"{{ item.value }}\" ng-model=\"model.attributes[field.index].attributeValue\">\n" +
    "                <label for=\"{{ field.id }}-{{ item.value }}\">{{ item.label }}</label>\n" +
    "            </div>\n" +
    "            \n" +
    "            <!-- <div ts-dcf-fields data-fields=\"field.extra\" data-model=\"model\"></div> -->\n" +
    "\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "\n" +
    "    <fieldset class=\"tscFormSection--Sub--Inline\" ng-if=\"field.type === 'checkbox'\" ng-show=\"show({field:field})\">\n" +
    "        <legend>{{ field.title }}</legend>\n" +
    "        <div class=\"tscFormSection-inner\">\n" +
    "            <div class=\"tseRadioBox--Normal--ColorNavigation{{ field.opt.style }}--Inline\">\n" +
    "                <input type=\"checkbox\" name=\"{{ field.id }}\" id=\"{{ field.id }}\" value=\"true\" ng-true-value=\"Ja\" ng-false-value=\"Nej\" ng-model=\"model.attributes[field.index].attributeValue\">\n" +
    "                <label for=\"{{ field.id }}\" data-checked=\"{{ field.opt.checked }}\">{{ field.opt.unchecked }}</label>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- <div ts-dcf-fields data-fields=\"field.extra\" data-model=\"model\"></div> -->\n" +
    "\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "\n" +
    "    <fieldset class=\"tscFormSection--Sub--Inline\" ng-if=\"field.type === 'radiospot'\" ng-show=\"show({field:field})\">\n" +
    "        <legend>{{ field.title }}</legend>\n" +
    "        <div class=\"tscFormSection-inner\">\n" +
    "            \n" +
    "            <div class=\"tseRadioBox--Normal--Spot--Inline\" ng-if=\"field.single\" ng-repeat=\"item in field.single\">\n" +
    "                <input type=\"radio\" name=\"{{ field.id }}\" id=\"{{ field.id }}-{{ item.value }}\" value=\"{{ item.value }}\" ng-model=\"model.attributes[field.index].attributeValue\">\n" +
    "                <label for=\"{{ field.id }}-{{ item.value }}\">\n" +
    "                    <h4>{{ item.label }}</h4>\n" +
    "                    <span>{{ item.unit }}</span>\n" +
    "                    <p>{{ item.price }}</p>\n" +
    "                </label>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"tscFormGroup--Inline\" ng-if=\"field.groups\" ng-repeat=\"group in field.groups\">\n" +
    "                <label>{{ group.title }}</label>\n" +
    "                <div class=\"tseRadioBox--Normal--Spot--Inline\" ng-repeat=\"item in group.options\">\n" +
    "                    <input type=\"radio\" name=\"{{ field.id }}\" id=\"{{ field.id }}-{{ item.value }}\"value=\"{{ item.value }}\" ng-model=\"model.attributes[field.index].attributeValue\">\n" +
    "                    <label for=\"{{ field.id }}-{{ item.value }}\">\n" +
    "                        <h4>{{ item.label }}</h4>\n" +
    "                        <span>{{ item.unit }}</span>\n" +
    "                        <p>{{ item.price }}</p>\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "\n" +
    "    <fieldset class=\"tscFormSection--Sub--Inline\" ng-if=\"field.type === 'text'\" ng-show=\"show({field:field})\">\n" +
    "        <legend>{{ field.title }}</legend>\n" +
    "        <div class=\"tscFormSection-inner\">\n" +
    "            <div class=\"tseTextField--Normal{{ field.opt.width }}{{ field.opt.inline ? '--Inline' : '' }}\">\n" +
    "                <label for=\"{{ field.id }}\">{{ field.title }}</label>\n" +
    "                <input type=\"text\" name=\"{{ field.id }}\" id=\"{{ field.id }}\" ng-model=\"model.attributes[field.index].attributeValue\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "\n" +
    "    <fieldset class=\"tscFormSection--Sub--Inline\" ng-if=\"field.type === 'select'\" ng-show=\"show({field:field})\">\n" +
    "        <legend>{{ field.title }}</legend>\n" +
    "        <div class=\"tscFormSection-inner\">\n" +
    "            <div class=\"tseSelect--Normal{{ field.opt.width }}\">\n" +
    "                <select name=\"{{ field.id }}\" id=\"{{ field.id }}\" ng-model=\"model.attributes[field.index].attributeValue\">\n" +
    "                    <option ng-repeat=\"item in field.opt.options\" value=\"{{ item.value }}\">{{ item.label }}</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- <div ts-dcf-fields data-fields=\"field.extra\" data-model=\"model\"></div> -->\n" +
    "\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "\n" +
    "    <div class=\"tseTextArea\" ng-if=\"field.type === 'textarea'\" ng-show=\"show({field:field})\">\n" +
    "        <label for=\"{{ field.id }}\">{{ field.title }}</label>\n" +
    "        <textarea name=\"{{ field.id }}\" id=\"{{ field.id }}\" rows=\"{{ field.opt.rows }}\" ng-model=\"model.attributes[field.index].attributeValue\"></textarea>\n" +
    "    </div>\n" +
    "\n" +
    "    <a ng-repeat-end ng-if=\"field.type === 'link'\" href=\"{{ field.opt.url }}\" ng-show=\"show({field:field})\"><i class=\"{{ field.opt.icon }}\"></i> {{ field.opt.title }}</a>\n" +
    "\n" +
    "</div>");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfShareDialogTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfShareDialogTemplate.html",
    "<button class=\"tsBtn--Border\" ng-click=\"toggle()\" ng-disabled=\"disabled || share.status\">{{ texts.shareDialogButton }}</button>\n" +
    "\n" +
    "<div class=\"wrapper tsClear\" ts-animate=\"opened\">\n" +
    "\n" +
    "    <div ts-validator=\"{{ name }}\">\n" +
    "\n" +
    "        <div class=\"tseTextField--Small ui-front\">\n" +
    "            <input type=\"text\" name=\"user\" data-rules=\"required\" data-value=\"\" ts-dcf-users ng-disabled=\"!share.users\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"tseTextArea--Small tsMarginTop\">\n" +
    "            <textarea rows=\"5\" ng-model=\"assign.message\"></textarea>\n" +
    "        </div>\n" +
    "\n" +
    "        <button type=\"submit\" ts-loading-button=\"share\" class=\"tsBtn--Border--Animated tsPullRight tsMarginTop\" ng-click=\"submit()\" ng-disabled=\"disabled || share.status\" data-status=\"share.status\" data-reset-after-complete=\"true\">{{ texts.shareButton }}</button>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "</div>");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfSummaryFieldsTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfSummaryFieldsTemplate.html",
    "<div class=\"tscInlineRow--Top tsMarginTop\" ng-repeat-start=\"field in fields\" ng-if=\"field.type !== 'textarea' && field.visible && !field.removeFieldInModel\" ng-init=\"initField(group, field)\">\n" +
    "    <div class=\"tscInlineRow-narrow\">\n" +
    "        <span class=\"grey\">{{ field.name }}</span>\n" +
    "    </div>\n" +
    "    <div class=\"tscInlineRow-main\">\n" +
    "        {{ model.attributes[field.index].attributeValue }}\n" +
    "    </div>     \n" +
    "</div>\n" +
    "<div class=\"tsBodyText\" ng-repeat-end  ng-if=\"field.type === 'textarea' && field.visible && !field.removeFieldInModel\">\n" +
    "    <p ng-bind-html=\"model.attributes[field.index].attributeValue\"></p>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/dcfTemplate.html",
    "<div ng-if=\"errorMessage\" class=\"tsAttention--Panic tsMarginTop tsMarginBottom tsAttention--tableLayout\">\n" +
    "    <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "        <i class=\"tsIcon-Information\"></i>\n" +
    "        <p class=\"tsAttention-Content\">\n" +
    "            <span>{{ errorMessage }}</span>\n" +
    "        </p>\n" +
    "        <a ng-click=\"resetError('errorMessage')\"><span>{{ texts.attentionClose }}</span><i class=\"tsIcon-Close\"></i></a>\n" +
    "    </div>\n" +
    "</div> <!-- END: div.tsAttention -->\n" +
    "\n" +
    "<div ng-if=\"isLoading && !errorMessage\" class='tscLoading--Full'>\n" +
    "    <div class='tsLoading-icon-large'></div>\n" +
    "    <p class=\"tsMarginTop grey\">{{ loadingStatus }}</p>\n" +
    "</div>\n" +
    "\n" +
    "<form class=\"dcfForm\" ng-if=\"page\" ts-validator=\"main\" data-validate-hidden=\"false\" data-disable-submit-button=\"false\" data-prevent-submit=\"false\" data-error-element-class=\"\" data-add-has-error-on-wrapper=\".field-wrapper\" data-default-message-include-name=\"false\">\n" +
    "\n" +
    "    <div ng-if=\"controlError\" class=\"tsAttention--Panic tsMarginBottom tsAttention--tableLayout\">\n" +
    "        <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "            <i class=\"tsIcon-Information\"></i>\n" +
    "            <p class=\"tsAttention-Content\">\n" +
    "                <span>{{ controlError }}</span>\n" +
    "            </p>\n" +
    "            <a ng-click=\"resetError('controlError')\"><span>{{ texts.attentionClose }}</span><i class=\"tsIcon-Close\"></i></a>\n" +
    "        </div>\n" +
    "    </div> <!-- END: div.tsAttention -->\n" +
    "\n" +
    "    <div class=\"tsWrapInner\">\n" +
    "\n" +
    "        <div class=\"tsClear\">\n" +
    "            \n" +
    "            <div ng-if=\"!isDone\" class=\"tscInline--GutterHalf tsPullRight\">\n" +
    "                <button class=\"tsBtn--Border--Animated\" ng-click=\"saveForm()\" ts-loading-button=\"save\" ng-disabled=\"isReadOnly() || saveStatus\" data-set-to-disabled=\"false\" data-status=\"saveStatus\" data-reset-after-complete=\"true\">{{ texts.saveButton }}</button>\n" +
    "                <div ts-dcf-share-dialog=\"shareTop\" data-share=\"share\" data-disabled=\"isReadOnly()\" data-share-form=\"shareForm(assign)\" ng-if=\"!displayUnshare()\" data-texts=\"texts\"></div>\n" +
    "                <button class=\"tsBtn--Border--Animated\" ng-if=\"displayUnshare()\" ng-click=\"unshareForm()\" ts-loading-button=\"unshare\" data-status=\"unshareStatus\" data-reset-after-complete=\"true\">{{ texts.unshareButton }}</button>\n" +
    "            </div>\n" +
    "            \n" +
    "            <h1 class=\"h1\">{{ getTitle(page) }}</h1>\n" +
    "        \n" +
    "        </div>\n" +
    "        \n" +
    "        <ul class=\"tscList--Inline--fullWidth tsMarginTop\">\n" +
    "            <li ng-repeat=\"p in pages\" ng-class=\"{ 'active': page - 1 === $index }\"><span class=\"tscStep\">{{ p.title }}</span></li>\n" +
    "            <li ng-class=\"{ 'active': isSummary }\"><span class=\"tscStep\">{{ texts.summaryTitle }}</span></li>\n" +
    "            <li ng-class=\"{ 'active': isDone }\"><span class=\"tscStep\">{{ texts.doneTitle }}</span></li>\n" +
    "        </ul>\n" +
    "    \n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"tsMarginTop\" ng-if=\"!isDone && page > 1\">\n" +
    "        \n" +
    "        <h2 class=\"h2 tsWrapInner tsMarginBottom\">Bilagor</h2>\n" +
    "        <ul ng-if=\"files\" class=\"tscList--Space tsMarginBottom\">\n" +
    "            <li ng-repeat=\"file in files\">\n" +
    "                <div ng-if=\"file.error\" class=\"tsAttention--Panic tsMarginBottom tsAttention--tableLayout\">\n" +
    "                    <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "                        <i class=\"tsIcon-Information\"></i>\n" +
    "                        <p class=\"tsAttention-Content\">\n" +
    "                            <span>{{ file.error }}</span>\n" +
    "                        </p>\n" +
    "                        <a ng-click=\"resetError(file)\"><span>{{ texts.attentionClose }}</span><i class=\"tsIcon-Close\"></i></a>\n" +
    "                    </div>\n" +
    "                </div> <!-- END: div.tsAttention -->\n" +
    "                <div class=\"tsWrapInner\">\n" +
    "                    <div class=\"tscInlineRow\">\n" +
    "                        <div class=\"tscInlineRow-main\">{{ file.filename }}</div>\n" +
    "                        <div class=\"tscInlineRow-nowrap\">\n" +
    "                            <button class=\"tsBtn--Animated\" ts-loading-button data-reset-after-complete=\"true\" data-status=\"file.downloadStatus\" ng-click=\"downloadFile(file)\">Ladda ner</button>\n" +
    "                        </div>\n" +
    "                        <div class=\"tscInlineRow-nowrap\">\n" +
    "                            <button class=\"tsBtn--Animated\" ts-loading-button data-reset-after-complete=\"true\" ng-disabled=\"isReadOnly() || file.removeStatus\" data-status=\"file.removeStatus\" ng-click=\"removeFile(file)\">Radera</button>\n" +
    "                        </div>\n" +
    "                        <div class=\"tscInlineRow-nowrap\">\n" +
    "                            <button class=\"tsBtn--File--Animated\" ts-loading-button data-reset-after-complete=\"true\" ng-disabled=\"isReadOnly() || file.uploadStatus\" data-status=\"file.uploadStatus\" ng-click=\"uploadFile(file)\">\n" +
    "                                <span>Uppdatera</span>\n" +
    "                                <input type=\"file\" ts-dcf-file>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    \n" +
    "        <div ng-if=\"newFile.error\" class=\"tsAttention--Panic tsMarginBottom tsAttention--tableLayout\">\n" +
    "            <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "                <i class=\"tsIcon-Information\"></i>\n" +
    "                <p class=\"tsAttention-Content\">\n" +
    "                    <span>{{ newFile.error }}</span>\n" +
    "                </p>\n" +
    "                <a ng-click=\"resetError(newFile)\"><span>{{ texts.attentionClose }}</span><i class=\"tsIcon-Close\"></i></a>\n" +
    "            </div>\n" +
    "        </div> <!-- END: div.tsAttention -->\n" +
    "        <div class=\"tsWrapInner\">\n" +
    "            <button class=\"tsBtn--File--Animated\" data-status=\"newFile.uploadStatus\" data-reset-after-complete=\"true\" ts-loading-button ng-disabled=\"isReadOnly() || newFile.uploadStatus\" ng-click=\"uploadFile(newFile)\">\n" +
    "                <span>Ladda upp ny bilaga</span>\n" +
    "                <input type=\"file\">\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tsWrapInner\" ng-if=\"pages.length >= page && page > 1\">\n" +
    "\n" +
    "        <fieldset ng-repeat=\"group in pages[page-1].groups\" class=\"dcfFormGroup\" ng-class=\"{ 'full': group.full, 'last': $last }\">\n" +
    "\n" +
    "            <legend>{{ group.title }}</legend>\n" +
    "            <div class=\"dcfFormGroup-inner\">\n" +
    "    \n" +
    "                <div class=\"fields-wrapper\" ng-repeat=\"wrapper in group.wrappers\">\n" +
    "                    \n" +
    "                    <div ts-dcf-field class=\"field-wrapper\" ng-class=\"field.classes\" ng-repeat-start=\"field in wrapper.fields\" ng-if=\"!field.fieldset\" data-field=\"field\" data-group=\"group\" data-show=\"showField(group, field)\" data-model=\"getDataModel(group, field)\" ng-show=\"field.visible\"></div>\n" +
    "                    \n" +
    "                    <!-- Maybe this is an issue\n" +
    "                         Putting a check for show field here will cause the field to be hidden\n" +
    "                         All inline fields (extra fields) will also be hidden -->\n" +
    "                    <fieldset class=\"dcfFormField\" ng-repeat-end ng-if=\"field.fieldset\" ng-show=\"field.visible\" ng-init=\"initField(group, field)\" ng-class=\"field.classes\">\n" +
    "                        <legend ng-hide=\"field.hideLabel\" ng-class=\"{'strong':field.strongLabel}\">{{ field.title }} {{ field.required ? '*' : '' }}</legend>\n" +
    "                        <p class=\"description\" ng-if=\"field.description\">{{ field.description }}</p>\n" +
    "                    \n" +
    "                        <div ts-dcf-field class=\"field-wrapper\" ng-class=\"field.classes\" data-field=\"field\" data-group=\"group\" data-model=\"getDataModel(group, field)\"></div>\n" +
    "                        \n" +
    "                        <!--<div ts-dcf-field class=\"field-wrapper\" ng-class=\"f.classes\" ng-if=\"field.extra\" ng-repeat=\"f in field.extra\" data-field=\"f\" data-group=\"group\" ng-show=\"showField(group, f)\" data-show=\"showField(group, f)\" data-model=\"getDataModel(group, f)\"></div>\n" +
    "                        -->\n" +
    "                    </fieldset>\n" +
    "                    \n" +
    "                    <fieldset class=\"dcfFormSection\" ng-repeat=\"section in wrapper.sections\" ng-show=\"section.visible\" ng-init=\"initField(group, section)\">\n" +
    "                        <legend ng-if=\"section.title\">{{ section.title }}</legend>\n" +
    "                        <p class=\"description\" ng-if=\"section.description\">{{ section.description }}</p>\n" +
    "                        <div class=\"dcfFormSection-inner\">            \n" +
    "                    \n" +
    "                            <div ts-dcf-field class=\"field-wrapper\" ng-class=\"field.classes\" ng-repeat=\"field in section.fields\" data-section=\"true\" data-field=\"field\" ng-show=\"field.visible\" ng-init=\"initField(group, field)\" data-model=\"getDataModel(group, field)\"></div>\n" +
    "                            \n" +
    "                        </div>\n" +
    "                    </fieldset>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "        </fieldset>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"page === 1\" class=\"tsWrapInner\">\n" +
    "        <div class=\"tscArea--Full--NearWhite--Double tsMarginTop\">\n" +
    "            <fieldset class=\"dcfFormField\">\n" +
    "                <legend class=\"strong\">{{ texts.chooseOrgLabel }}</legend>\n" +
    "                <div class=\"dcfFormField-inner\">\n" +
    "                    <div class=\"tseSelect--Half\">\n" +
    "                        <select ng-disabled=\"chooseOrg.disabled\" name=\"organization\" id=\"organization\" ng-model=\"chooseOrg.org\" ng-options=\"org.id as org.label for org in chooseOrg.orgs\">\n" +
    "                            <option value=\"\">{{ texts.chooseOrgOption }}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"page === 1\" ng-show=\"!chooseOrg.org\" class=\"tsAttention--Panic tsMarginTop tsAttention--tableLayout\">\n" +
    "        <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "            <i class=\"tsIcon-Information\"></i>\n" +
    "            <p class=\"tsAttention-Content\">\n" +
    "                <span>{{ texts.chooseOrgWarning }}</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div> <!-- END: div.tsAttention -->\n" +
    "\n" +
    "    <div ng-if=\"isSummary || isDone\" class=\"tscArea--Large--NearWhite{{ isDone ? '--NoTop' : '' }}\" ng-class=\"{ 'tsMarginTop--doubleGutter': isSummary }\"> \n" +
    "\n" +
    "        <div ng-if=\"isDone\" ng-show=\"templateError\" class=\"tsAttention--Panic tsMarginTop tsAttention--tableLayout\">\n" +
    "            <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "                <i class=\"tsIcon-Information\"></i>\n" +
    "                <p class=\"tsAttention-Content\">\n" +
    "                    <span>{{ templateError }}</span>\n" +
    "                </p>\n" +
    "                <a ng-click=\"resetError('templateError')\"><span>{{ texts.attentionClose }}</span><i class=\"tsIcon-Close\"></i></a>\n" +
    "            </div>\n" +
    "        </div> <!-- END: div.tsAttention -->\n" +
    "\n" +
    "        <div ng-if=\"isDone\" class=\"tsAttention--Info tsMarginTop tsMarginBottom tsAttention--tableLayout\">\n" +
    "            <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "                <i class=\"tsIcon-Information\"></i>\n" +
    "                <p class=\"tsAttention-Content\">\n" +
    "                    <span><strong ng-if=\"texts.saveTemplateHeading\">{{ texts.saveTemplateHeading }}</strong> {{ texts.saveTemplateText }}</span>\n" +
    "                    <button href ts-loading-button=\"template\" data-status=\"templateStatus\" class=\"tsBtn--Animated\" ng-click=\"saveTemplate()\" data-reset-after-complete=\"true\">{{ texts.saveTemplateButton }}</button>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div> <!-- END: div.tsAttention -->\n" +
    "\n" +
    "        <div ng-if=\"sendError\" class=\"tsAttention--Panic tsMarginBottom tsAttention--tableLayout\">\n" +
    "            <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "                <i class=\"tsIcon-Information\"></i>\n" +
    "                <p class=\"tsAttention-Content\">\n" +
    "                    <span>{{ sendError }}</span>\n" +
    "                </p>\n" +
    "                <a ng-click=\"resetError('sendError')\"><span>{{ texts.attentionClose }}</span><i class=\"tsIcon-Close\"></i></a>\n" +
    "            </div>\n" +
    "        </div> <!-- END: div.tsAttention -->\n" +
    "\n" +
    "        <div class=\"tsWrapInner\">\n" +
    "            <div class=\"tscArea--White--Full--Border\">\n" +
    "                \n" +
    "                <!-- the product information -->\n" +
    "                <div class=\"tscArea\">\n" +
    "                    <div class=\"tscInlineRow\">\n" +
    "                        <div>\n" +
    "                            <i class=\"tsIcon-Configure\"></i>\n" +
    "                        </div>       \n" +
    "                        <div class=\"tscInlineRow-main\">\n" +
    "                            <h4 class=\"h4 normal grey\">{{ texts.productHeading }}</h4>\n" +
    "                            <h1 class=\"h1\">{{ title }}</h1>\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"isSummary\">\n" +
    "                            <button class=\"tsBtn--Animated\" ts-loading-button=\"send\" ng-disabled=\"isReadOnly() || sendStatus\" ng-click=\"sendForm()\" data-status=\"sendStatus\" data-reset-after-complete=\"true\">{{ texts.saveAndSendButtonLabel }}</button>\n" +
    "                            <p class=\"grey small center\"><em>{{ texts.saveAndSendDescription }}</em></p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <!-- groups -->\n" +
    "                <div class=\"tscArea\" ng-repeat=\"template in [false, true]\">\n" +
    "                    <div ng-repeat=\"group in allGroups\" ng-if=\"group.template === template\">\n" +
    "                        <div ng-if=\"isDone && template\" class=\"tseRadioBox--CheckButton--ColorNavigation\">\n" +
    "                            <input type=\"checkbox\" id=\"{{ group.id }}\" name=\"{{ group.id }}\" ng-model=\"group.save\">\n" +
    "                            <label for=\"{{ group.id }}\" class=\"h2\">{{ group.title }}</label>\n" +
    "                        </div>\n" +
    "                        <h2 ng-if=\"isSummary && template\" class=\"h2\">{{ group.title }}</h2>\n" +
    "                        <h3 ng-if=\"!template\" class=\"h3\" ng-class=\"{ 'tsMarginTop': !$first }\">{{ group.title }}</h3>\n" +
    "                        \n" +
    "                        <div ng-repeat=\"wrapper in group.wrappers\">\n" +
    "                            <div class=\"tscInlineRow--Top tsMarginTop\" ng-repeat-start=\"field in wrapper.fields\" ng-if=\"field.type !== 'textarea' && field.visible && !field.removeFieldInModel\" ng-init=\"initField(group, field)\">\n" +
    "                                <div class=\"tscInlineRow-narrow\">\n" +
    "                                    <span class=\"grey\">{{ field.name }}</span>\n" +
    "                                </div>\n" +
    "                                <div class=\"tscInlineRow-main\">\n" +
    "                                    {{ model.groups[group.index].attributes[field.index].attributeValue }}\n" +
    "                                </div>     \n" +
    "                            </div>\n" +
    "                            <div class=\"tsBodyText\" ng-repeat-end  ng-if=\"field.type === 'textarea' && field.visible && !field.removeFieldInModel\">\n" +
    "                                <p ng-bind-html=\"model.attributes[field.index].attributeValue\"></p>\n" +
    "                            </div>\n" +
    "                            <div class=\"row\" ng-if=\"wrapper.sections\">\n" +
    "                                <div class=\"col-md-6 tsMarginTop\" ng-repeat=\"section in wrapper.sections\" ng-if=\"section.visible\" ng-init=\"initField(group, section)\">\n" +
    "                                    <h4 class=\"h4\">{{ section.title }}</h4>\n" +
    "                                    <div class=\"tscInlineRow--Top tsMarginTop\" ng-repeat-start=\"field in section.fields\" ng-if=\"field.type !== 'textarea' && field.visible && !field.removeFieldInModel\" ng-init=\"initField(group, field)\">\n" +
    "                                        <div class=\"tscInlineRow-narrow\">\n" +
    "                                            <span class=\"grey\">{{ field.name }}</span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"tscInlineRow-main\">\n" +
    "                                            {{ model.groups[group.index].attributes[field.index].attributeValue }}\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"tsBodyText\" ng-repeat-end  ng-if=\"field.type === 'textarea' && field.visible && !field.removeFieldInModel\">\n" +
    "                                        <p ng-bind-html=\"model.attributes[field.index].attributeValue\"></p>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    \n" +
    "    <div ng-if=\"validationError\" class=\"tsAttention--Panic tsMarginTop tsAttention--tableLayout\">\n" +
    "        <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "            <i class=\"tsIcon-Information\"></i>\n" +
    "            <p class=\"tsAttention-Content\">\n" +
    "                <span>{{ texts.validationError }}</span>\n" +
    "            </p>\n" +
    "            <a ng-click=\"resetError('validationError')\"><span>{{ texts.attentionClose }}</span><i class=\"tsIcon-Close\"></i></a>\n" +
    "        </div>\n" +
    "    </div> <!-- END: div.tsAttention -->\n" +
    "\n" +
    "    <div ng-if=\"controlError\" class=\"tsAttention--Panic tsMarginTop tsAttention--tableLayout\">\n" +
    "        <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "            <i class=\"tsIcon-Information\"></i>\n" +
    "            <p class=\"tsAttention-Content\">\n" +
    "                <span>{{ controlError }}</span>\n" +
    "            </p>\n" +
    "            <a ng-click=\"resetError('controlError')\"><span>{{ texts.attentionClose }}</span><i class=\"tsIcon-Close\"></i></a>\n" +
    "        </div>\n" +
    "    </div> <!-- END: div.tsAttention -->\n" +
    "\n" +
    "    <div ng-if=\"!isDone\" class=\"tsWrapInner tsMarginTop center\">\n" +
    "\n" +
    "        <div class=\"tscInline--GutterHalf\">\n" +
    "\n" +
    "            <button class=\"tsBtn--Border--Animated\" ng-click=\"saveForm()\" ts-loading-button=\"save\" ng-disabled=\"isReadOnly() || saveStatus\" data-set-to-disabled=\"false\" data-status=\"saveStatus\" data-reset-after-complete=\"true\">{{ texts.saveButton }}</button>\n" +
    "            <div ts-dcf-share-dialog=\"shareBottom\" data-share=\"share\" data-wrapper=\"above\" data-disabled=\"isReadOnly()\" data-share-form=\"shareForm(assign)\" ng-if=\"!displayUnshare()\" data-texts=\"texts\"></div>\n" +
    "            <button class=\"tsBtn--Border--Animated\" ng-if=\"displayUnshare()\" ng-click=\"unshareForm()\" ts-loading-button=\"unshare\" data-status=\"unshareStatus\" data-reset-after-complete=\"true\">{{ texts.unshareButton }}</button>\n" +
    "            \n" +
    "            <!-- next step -->\n" +
    "            <button class=\"tsBtn\" ng-click=\"setPage(page + 1)\" ng-if=\"page < pages.length + 1 && page > 1\">{{ texts.nextStep }} {{ getPageTitle(page + 1) }}</button>\n" +
    "            <button class=\"tsBtn--Animated\" ng-click=\"loadForm()\" ts-loading-button=\"formLoad\" data-reset-after-complete=\"true\" data-status=\"formLoadingStatus\" ng-if=\"page === 1\" ng-disabled=\"!chooseOrg.org || formLoadingStatus\">{{ texts.nextStep }} {{ getPageTitle(page + 1) }}</button>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <p class=\"tsMarginTop--halfGutter\">\n" +
    "            <a href ng-if=\"page > 1\" ng-click=\"setPage(page-1)\"><strong>{{ texts.prevStep }}</strong> {{ getPageTitle(page - 1) }}</a>\n" +
    "            <span ng-if=\"page > 1\">|</span>\n" +
    "            <a href ng-click=\"cancel()\"><strong>{{ texts.cancel }}</strong></a>\n" +
    "        </p>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageCustomTableTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageCustomTableTemplate.html",
    "<div class=\"tsMarginBottom--doubleGutter\">\n" +
    "    <div class=\"tscArea--LighterGrey--Border\">\n" +
    "        <div class=\"tsWrapInner tscInline\" ng-if=\"customization.add.enabled\">         \n" +
    "            <div class=\"tscForm--InsetInline\">\n" +
    "                <div class=\"tscFormSection--Inline\">\n" +
    "                    <form ng-submit=\"add()\">\n" +
    "                        <div class=\"tseTextField--Normal--Wide--InlineHalf\" ng-repeat=\"f in customization.add.fields\" >\n" +
    "                            <input type=\"{{f.type}}\" name=\"{{f.name}}\" ng-disabled=\"add.loading\" placeholder=\"{{f.placeholder}}\" ng-model=\"f.value\" />\n" +
    "                            <span ng-if=\"f.validation.error != ''\" class=\"error\">{{f.validation.error}}</span>\n" +
    "                        </div>\n" +
    "                        <button type=\"submit\" class=\"tsBtn--Normal--Regular--Animated\" ts-loading-button x-status=\"add.status\" x-click-enabled=\"false\" x-progress-text=\"Saving\" x-failure-text=\"Oops, try again\">{{customization.add.submitText}}</button>\n" +
    "                    </form>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"tsAttention--Panic tsMarginBottom\" data-id=\"addTableRowObjectStatusContainer\" ng-if=\"add.error !== null\">\n" +
    "        <div class=\"tsAttention-Message tsAttention-MessageClosable tsWrapInner\">\n" +
    "                <i class=\"tsIcon-Panic\"></i>\n" +
    "                <p>\n" +
    "                    <strong class=\"tsAttention-heading\" data-id=\"billingAddressStatusHeader\">{{customization.add.errorPrefixText}}</strong>\n" +
    "                    <a class=\"tsAttention-closeMessage\" data-toggle=\"collapse\" data-target=\"[data-id=addTableRowObjectStatusContainer]\" href=\"/\"><span>Stäng</span> <i class=\"tsIcon-Close\"></i></a>\n" +
    "                    <span data-id=\"billingAddressStatusText\">{{add.error}}</span>\n" +
    "                </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupBatchTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupBatchTemplate.html",
    "<div ng-if=\"getOrganisationsSuccess\" class=\"tsAttention--Info tsAttention--tableLayout\">\n" +
    "    <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "        <i class=\"tsIcon-Information\"></i>\n" +
    "        <p class=\"tsAttention-Content\">\n" +
    "            <span>{{ getOrganisationsSuccess }}</span>\n" +
    "        </p>\n" +
    "        <a ng-click=\"resetError('getOrganisationsSuccess')\"><span>Stäng</span><i class=\"tsIcon-Close\"></i></a>\n" +
    "    </div>\n" +
    "</div> <!-- END: div.tsAttention -->\n" +
    "\n" +
    "<div ng-if=\"getOrganisationsError\" class=\"tsAttention--Panic tsAttention--tableLayout\">\n" +
    "    <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "        <i class=\"tsIcon-Panic\"></i>\n" +
    "        <p class=\"tsAttention-Content\">\n" +
    "            <span>{{ getOrganisationsError }}</span>\n" +
    "        </p>\n" +
    "        <a ng-click=\"resetError('getOrganisationsError')\"><span>Stäng</span><i class=\"tsIcon-Close\"></i></a>\n" +
    "    </div>\n" +
    "</div> <!-- END: div.tsAttention -->\n" +
    "\n" +
    "<div class=\"tsWrapInner tsMarginTop\">\n" +
    "\n" +
    "    <div class=\"tseTextArea\">\n" +
    "        <label>{{ translationGroup.translate(\"GET_ORGANISATIONS_CSV\") }}</label>\n" +
    "        <textarea ng-model=\"organisationsText\" rows=\"5\"></textarea>\n" +
    "    </div>\n" +
    "    <button class=\"tsBtn--Animated tsMarginTop\" ts-loading-button data-status=\"getOrganisationsStatus\" data-reset-after-complete=\"true\" ng-click=\"getOrganisations(organisationsText)\" ng-disabled=\"!organisationsText\">{{ translationGroup.translate(\"GET_ORGANISATIONS_BUTTON\") }}</button>\n" +
    "\n" +
    "</div>");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupCollectTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupCollectTemplate.html",
    "<div ts-manage-group-batch></div>\n" +
    "\n" +
    "<div ts-manage-group-search class=\"tsMarginTop\"></div>\n" +
    "\n" +
    "<div ts-manage-group-organisations class=\"tsMarginTop\"></div>\n" +
    "\n" +
    "<div class=\"center tsMarginTop\">\n" +
    "    <button class=\"tsBtn\" ng-click=\"next()\">Create Organization Group</button>\n" +
    "</div>");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupMainTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupMainTemplate.html",
    "<div class=\"tsForm\" ts-validator>\n" +
    "    <div class=\"tsWrapInner\">\n" +
    "	   create group\n" +
    "\n" +
    "        <div class=\"tsMarginTop tsPaddingTop tsBorderTop\">\n" +
    "            <h2 class=\"h2\">{{ translationGroup.translate(\"GROUP_FORM_TITLE\") }}</h2>\n" +
    "            <ul class=\"tscList tsPaddingTop\">\n" +
    "                <form name=\"groupInformationForm\">\n" +
    "                <li class=\"tscInfoRow\">\n" +
    "                    <span>{{ translationGroup.translate(\"GROUP_FORM_NAME\") }}</span>\n" +
    "                    <div>\n" +
    "                        <input class=\"tseInput\" name=\"name_field\" type=\"text\" ng-model=\"organizationCustom.name\" require ng-pattern=\"/\\S/\"/>\n" +
    "                        <div><span class=\"error\" ng-show=\"groupInformationForm.name_field.$error.pattern\">Ett namn måste anges</span></div>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"tscInfoRow\">\n" +
    "                    <span>{{ translationGroup.translate(\"GROUP_FORM_PHONE\") }}</span>\n" +
    "                    <div>\n" +
    "                        <input class=\"tseInput\" name=\"phone_field\" type=\"text\" ng-model=\"organizationCustom.phone\" require ng-pattern=\"\"/>\n" +
    "                    <div><span class=\"error\" ng-show=\"groupInformationForm.phone_field.$error.pattern\">Inte ett giltligt telefonnummer!</span></div>\n" +
    "                </div>\n" +
    "                </li>\n" +
    "                <li class=\"tscInfoRow\">\n" +
    "                    <span>{{ translationGroup.translate(\"GROUP_FORM_WEBSITE\") }}</span>\n" +
    "                    <div>\n" +
    "                        <input class=\"tseInput\" type=\"input\" ng-model=\"organizationCustom.website\"/>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"tscInfoRow\">\n" +
    "                    <span>{{ translationGroup.translate(\"GROUP_FORM_COST\") }}</span>\n" +
    "                    <div>\n" +
    "                        <input class=\"tseInput\" type=\"input\" ng-model=\"organizationCustom.cost\"/>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"tscInfoRow\">\n" +
    "                    <span>{{ translationGroup.translate(\"GROUP_FORM_AF_NUMBER\") }}</span>\n" +
    "                    <div>\n" +
    "                        <input class=\"tseInput\" type=\"input\" ng-model=\"organizationCustom.afNumber\"/>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"tscInfoRow\">\n" +
    "                    <span>{{ translationGroup.translate(\"GROUP_FORM_CONTACT_PERSON\") }}</span>\n" +
    "                    <div>\n" +
    "                        <input class=\"tseInput\" type=\"input\" ng-model=\"organizationCustom.contactPerson\"/>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"tscInfoRow\">\n" +
    "                    <span>{{ translationGroup.translate(\"GROUP_FORM_PROFITABILITY_SEGMENT\") }}</span>\n" +
    "                    <div>\n" +
    "                        <select ts-select=\"tseSelect--Normal--Narrow\" ng-model=\"organizationCustom.profitabilitySegment\">\n" +
    "                            <option value=\"null\">Inget valt</option>\n" +
    "                            <option>Retail</option>\n" +
    "                            <option>Something else</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!-- Access tree -->\n" +
    "<div class=\"tsWrapInner\">\n" +
    "    <div class=\"tsMarginTop tsPaddingTop tsBorderTop\">\n" +
    "        <h2 class=\"h2\">Portal access *</h2>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"tsConfigure-container tsPaddingTop\">\n" +
    "    <div class=\"tsPortalAccess\">\n" +
    "        <div ts-access-tree=\"\" organization-mode=\"true\"\n" +
    "             full-access-text=\"Full access\" partial-access-text=\"Partiell access\" no-access-text=\"Ingen access\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- END: Access tree -->\n" +
    "\n" +
    "<div ts-manage-group-search class=\"tsMarginTop\"></div>\n" +
    "\n" +
    "<div ts-manage-group-organisations class=\"tsMarginTop\"></div>\n" +
    "\n" +
    "<div class=\"center tsMarginTop tsMarginBottom\">\n" +
    "    <input type=\"submit\" ng-click=\"createMasterGroup()\" class=\"tsBtn\" value=\"Spara\">\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupOrganisationsTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupOrganisationsTemplate.html",
    "<div class=\"tsWrapInner\" ts-custom-table ng-show=\"organisationNumbers.length > 0\"\n" +
    "    x-page-size=\"20\"\n" +
    "    x-row-details-enabled=\"false\"\n" +
    "    x-initial-sort-field=\"name\"\n" +
    "    x-data-definition-identity=\"organizationTscid\"\n" +
    "    x-data-definition-columns-expr=\"tableParent.columns\"\n" +
    "    x-api-is-angular-service=\"true\"\n" +
    "    x-api-name=\"local/angularApplications/services/manageGroupNgService\"\n" +
    "    x-api-action-fn-name=\"removeOrganisation\"\n" +
    "    x-api-delete-row-after-action=\"true\"\n" +
    "    x-api-data-fn-name=\"getOrganizations\"\n" +
    "    x-api-data-fn-parameters='[]'\n" +
    "    x-api-allow-data-update=\"true\"\n" +
    "    x-row-delete-enabled=\"true\"\n" +
    "    x-row-delete-id-property=\"organizationTscid\"\n" +
    "    x-row-delete-display-template=\"false\">\n" +
    "</div>");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupSearchTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageGroupSearchTemplate.html",
    "<div class=\"tsWrapInner\">\n" +
    "    <div class=\"search header-search\">\n" +
    "        <div class=\"search-inner\">\n" +
    "            <form class=\"search-form\" ng-submit=\"search(searchText)\">\n" +
    "                <span role=\"status\" aria-live=\"polite\" class=\"ui-helper-hidden-accessible\"></span>\n" +
    "                <!-- Style input field to highlight that it is disabled --> \n" +
    "                <input type=\"search\" class=\"search-field ui-autocomplete-input\" name=\"search\" placeholder='{{ translationGroup.translate(\"SEARCH_PLACEHOLDER\") }}' autocomplete=\"off\" ng-model=\"searchText\" ng-disabled=\"searching\">\n" +
    "                <i class=\"tsIcon-Search\"></i>\n" +
    "                <input type=\"submit\" ng-disabled=\"!searchText || searching\" class=\"search-submit\" value=\"Sök\">\n" +
    "            </form>\n" +
    "        </div>\n" +
    "\n" +
    "        \n" +
    "\n" +
    "        <ul ng-if=\"searchPerformed || searching || searchResult.length\">\n" +
    "        	<li ng-if=\"!searchResult.length && searchPerformed\">Inga resultat</li>\n" +
    "        	<li ng-if=\"!searchPerformed && searching\">\n" +
    "        		<div class=\"tscLoading--Full--PaddingHalfGutter--BackgroundWhite\">\n" +
    "        			<div class=\"tsLoading-icon-large\"></div>\n" +
    "        		</div>\n" +
    "        	</li>\n" +
    "        	<li class=\"tsPaddingTop--halfGutter tsPaddingBottom--halfGutter\" ng-repeat=\"organization in searchResult\" style=\"position: relative;\">\n" +
    "                <h2>{{ organization.name }} {{organization.organizationNumber}} <span class=\"tsPullRight fontSize-small tsMarginLeft--halfGutter\" ng-show=\"organization.alreadyInMainGroup\">Finns i huvudgrupp</span></h2>\n" +
    "                <i ng-show=\"!organization.listed && !organization.alreadyInMainGroup\" ng-click=\"addOrganization(organization); (organization.listed = true)\" class=\"tsIcon-Add\"></i>\n" +
    "                <i ng-show=\"organization.listed && !organization.alreadyInMainGroup\" ng-click=\"deleteOrganization(organization); (organization.listed = false)\" class=\"tsIcon-Delete\"></i>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"isError && !hideGroupAttention\" class=\"tsAttention--Panic tsMarginTop\">\n" +
    "    <div class=\"tsAttention-Message tsAttention-MessageClosable tsWrapInner\">\n" +
    "        <i class=\"tsIcon-Panic\"></i>\n" +
    "        <p>\n" +
    "            <strong class=\"tsAttention-heading\">Error:</strong>\n" +
    "            <a class=\"tsAttention-closeMessage\" ng-click=\"hideGroupAttention = true\"><span>Close</span> <i class=\"tsIcon-Close\"></i></a>\n" +
    "            <span>{{ errorMessage }}</span>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"isSuccess && !hideGroupAttention\" class=\"tsAttention--Info tsMarginTop\">\n" +
    "    <div class=\"tsAttention-Message tsAttention-MessageClosable tsWrapInner\">\n" +
    "        <i class=\"tsIcon-Information\"></i>\n" +
    "        <p>\n" +
    "            <strong class=\"tsAttention-heading\">Success:</strong>\n" +
    "            <a class=\"tsAttention-closeMessage\" ng-click=\"hideGroupAttention = true\"><span>Close</span> <i class=\"tsIcon-Close\"></i></a>\n" +
    "            <span>Du har sparat dina preferenser</span>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageInviteTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageInviteTemplate.html",
    "<div class=\"tsAttention--Panic tsMarginBottom\" ng-if=\"displayOrganisationsWarning\">\n" +
    "    <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "        <p class=\"tscInline--Middle\">\n" +
    "            <i class=\"tsIcon-Panic tscInline-Element\"></i>\n" +
    "            <span>{{ translationInvite.translate(\"UNAVAILABLE_ORGANISATIONS\") }}</span>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"isLoading\" class=\"tscLoading tsMarginTop tsMarginBottom\"><span class=\"tsLoading-icon-large\"></span></div>\n" +
    "\n" +
    "<div class=\"tsAttention--Panic tsAttention--tableLayout tsMarginBottom\" ng-if=\"loadingError\">\n" +
    "    <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "        <i class=\"tsIcon-Panic\"></i>\n" +
    "        <div class=\"tsAttention-Content\">\n" +
    "            <span>{{ loadingError }}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<form ts-validator ng-if=\"!isLoading && !loadingError\">\n" +
    "\n" +
    "    <div class=\"tsAttention--Info tsMarginBottom tsAttention--tableLayout\" ng-if=\"invite.invitedBy\">\n" +
    "        <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "            <i class=\"tsIcon-Information\"></i>\n" +
    "            <p class=\"tsAttention-Content\">\n" +
    "                <span ng-if=\"invite.userInfoLoading\" class=\"tsLoading-icon\"></span>\n" +
    "                <span ng-if=\"invite.invitedByName\">{{ translationInvite.translate(\"INVITE_SENT\", [invite.invitedByName, utils.formatDate(invite.createDate)]) }}</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tsWrapInner\">\n" +
    "        \n" +
    "        <div class=\"tscInline--Middle tsMarginBottom tsMarginTop\">\n" +
    "            <span class=\"tscInline-Element--Narrow grey\">{{ translationInvite.translate(\"FIRSTNAME\") }}</span>\n" +
    "            <div class=\"tseTextField--Half\">\n" +
    "                <input type=\"text\" ng-model=\"invite.firstName\" maxlength=\"50\">\n" +
    "            </div>\n" +
    "        </div>        \n" +
    "\n" +
    "        <div class=\"tscInline--Middle tsMarginBottom\">\n" +
    "            <span class=\"tscInline-Element--Narrow grey\">{{ translationInvite.translate(\"LASTNAME\") }}</span>\n" +
    "            <div class=\"tseTextField--Half\">\n" +
    "                <input type=\"text\" ng-model=\"invite.lastName\" maxlength=\"50\">\n" +
    "            </div>\n" +
    "        </div>        \n" +
    "\n" +
    "        <div class=\"tscInline--Middle tsMarginBottom\">\n" +
    "            <span class=\"tscInline-Element--Narrow grey\">{{ translationInvite.translate(\"MOBILE\") }} *</span>\n" +
    "            <div class=\"tseTextField--Half\">\n" +
    "                <input type=\"text\" name=\"mobile\" ng-model=\"invite.mobileNumber\" data-rules=\"required mobilenumber\" data-message-mobilenumber=\"MOBILE_ERROR\" data-message-required=\"MOBILE_ERROR_REQUIRED\" maxlength=\"50\">\n" +
    "            </div>\n" +
    "        </div>        \n" +
    "\n" +
    "        <div class=\"tscInline--Middle tsMarginBottom\">\n" +
    "            <span class=\"tscInline-Element--Narrow grey\">{{ translationInvite.translate(\"EMAIL\") }} *</span>\n" +
    "            <div class=\"tseTextField--Half\">\n" +
    "                <input type=\"text\" name=\"email\" ng-model=\"invite.email\" data-rules=\"required email\" data-message-email=\"EMAIL_ERROR\" data-message-required=\"EMAIL_ERROR_REQUIRED\" maxlength=\"100\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"tscInline tsMarginBottom\">\n" +
    "            <span class=\"tscInline-Element--Narrow grey tsMarginTop--halfGutter\">{{ translationInvite.translate(\"COMMENT\") }}</span>\n" +
    "            <div class=\"tseTextArea--Wide\">\n" +
    "                <textarea rows=\"8\" ng-model=\"invite.inviteText\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tsAttention--Info tsMarginBottom\">\n" +
    "        <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "            <p class=\"tscInline--Middle\">\n" +
    "                <i class=\"tsIcon-Information tscInline-Element\"></i>\n" +
    "                <span>{{ translationInvite.translate(\"GENERAL_ROLES_INFO\") }}</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    \n" +
    "    \n" +
    "    <div class=\"tsWrapInner\">\n" +
    "\n" +
    "        <div ts-combine-roles data-header-text-expr=\"texts.generalHeader\" data-add-text-expr=\"texts.generalAddText\" data-instance=\"instances.general\" data-manage-text-expr=\"texts.generalManageText\" data-manage-enabled=\"true\" data-manage-init=\"true\" class=\"tsMarginBottom tsClear\">\n" +
    "        </div> \n" +
    "\n" +
    "        <h2 class=\"h2\">{{ translationInvite.translate(\"GENERAL_ACCESS\") }}</h2>\n" +
    "\n" +
    "        <div ts-access-list data-instance=\"instances.general\" data-read-only=\"true\" data-full-access-text=\"FULL_ACCESS\" data-partial-access-text=\"PARTIAL_ACCESS\" data-no-access-text=\"NO_ACCESS\"></div>\n" +
    "\n" +
    "    </div>\n" +
    "    \n" +
    "    <div class=\"tsMarginBottom\" ng-if=\"isAdmin\">\n" +
    "\n" +
    "        <div class=\"tsAttention--Info tsMarginBottom tsAttention--tableLayout\" ng-if=\"addedOrganisations\">\n" +
    "            <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "                <i class=\"tsIcon-Information\"></i>\n" +
    "                <p class=\"tsAttention-Content\">\n" +
    "                    <span>{{ addedOrganisations }}</span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"tsAttention--Info tsMarginBottom tsAttention--tableLayout\">\n" +
    "            <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "                <i class=\"tsIcon-Information\"></i>\n" +
    "                <p class=\"tsAttention-Content\">\n" +
    "                    <span>{{ translationInvite.translate(\"ADMIN_ORGANISATIONS\") }}</span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"tsWrapInner tsClear\">\n" +
    "            <div ts-saved-organizations data-read-only=\"true\" data-header=\"INVITE_HEADER\" data-manage=\"INVITE_MANAGE\" data-close=\"INVITE_CLOSE\" data-add=\"INVITE_ADD\" data-no-result=\"INVITE_NO_RESULT\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"organisationErrorRequired\" class=\"tsAttention--Panic tsAttention--tableLayout tsMarginBottom\">\n" +
    "        <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "            <i class=\"tsIcon-Panic\"></i>\n" +
    "            <div class=\"tsAttention-Content\">\n" +
    "                <span>{{ organisationErrorRequired }}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tsWrapInner\">\n" +
    "\n" +
    "        <div class=\"tscArea--Full--NearWhite tsMarginTop tsMarginBottom\">\n" +
    "            <h2 class=\"h2 tsMarginBottom\">{{ translationInvite.translate(\"MY_ORGANISATIONS\") }}</h2>\n" +
    "            <ul class=\"tscList\" data-rules=\"required\" data-message-required=\"NO_ORGANISATIONS_SELECTED_ERROR\" data-name=\"organisation\" data-type=\"checkbox\" ts-validator-error=\"organisationErrorRequired\">\n" +
    "                <li ng-repeat=\"org in inviteOrgs\">\n" +
    "                    <div class=\"tseRadioBox--Normal--CheckButton--ColorNavigation\" ng-class=\"{ readOnly: !org.editable }\">\n" +
    "                        <input id=\"org-{{ org.id }}\" type=\"checkbox\" ng-model=\"org.$selected\" value=\"true\" ng-disabled=\"!org.editable\" ng-change=\"manageInviteNgService.updateInviteOrganisation(org)\">\n" +
    "                        <label for=\"org-{{ org.id }}\">{{ org.name }}</label>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-transclude></div>\n" +
    "\n" +
    "    <div class=\"tsWrapInner\">\n" +
    "\n" +
    "        <div ts-dynamic-custom-table\n" +
    "            x-dropdown-enabled=\"false\"\n" +
    "            x-search-text-expr='tableParent.translationInvite.translate(\"FILTER_PLACEHOLDER\")'\n" +
    "            x-search-enabled=\"true\"\n" +
    "            x-page-size=\"15\"\n" +
    "            x-initial-sort-field=\"name\"\n" +
    "            x-multiple-selection-enabled=\"false\"\n" +
    "            x-open-link-enabled=\"false\"\n" +
    "            x-open-link-url=\"{link}\" \n" +
    "            x-row-details-header=\"\"\n" +
    "            x-row-details-button-text-expr='tableParent.translationInvite.translate(\"CUSTOMIZE_ROLES\")'\n" +
    "            x-row-details-button-text-expanded=\"\"\n" +
    "            x-row-details-button-disabled-expression=\"p.$rowActionCalled\"\n" +
    "            x-row-details-button-disabled-text=\"\"\n" +
    "            x-row-details-template='<div class=\"tsWrapInner tsPaddingTop tsPaddingBottom\"><div class=\"tsPaddingLeft tsPaddingRight\">\n" +
    "                <div ts-combine-roles data-instance=\"tableParent.instances.orgPrefix + p.id\" data-header-text-expr=\"tableParent.translationInvite.translate(&#39;ADD_ROLES_FOR_ORG&#39;, [p.name])\" data-add-text-expr=\"tableParent.texts.orgAddText\" data-manage-text-expr=\"tableParent.texts.orgManageText\" data-manage-enabled=\"true\" data-manage-init=\"true\" class=\"tsClear\"></div>\n" +
    "                <h3 class=\"h3 tsMarginTop\">{ tableParent.translationInvite.translate(&#39;ACCESS_FOR_ORG&#39;, [p.name]) }</h3>\n" +
    "                <div ts-access-list data-instance=\"tableParent.instances.orgPrefix + p.id\" data-read-only=\"true\" data-full-access-text=\"FULL_ACCESS\" data-partial-access-text=\"PARTIAL_ACCESS\" data-no-access-text=\"NO_ACCESS\"></div>\n" +
    "            </div></div>'\n" +
    "            x-row-details-break-free=\"true\"\n" +
    "            x-hard-filter-enabled=\"false\"\n" +
    "            x-data-definition-identity=\"id\"\n" +
    "            x-data-definition-columns-expr=\"tableParent.columns\"\n" +
    "            x-api-is-angular-service=\"true\"\n" +
    "            x-api-name=\"local/angularApplications/services/manageInviteNgService\"\n" +
    "            x-api-action-fn-name=\"removeInviteOrganisation\"\n" +
    "            x-api-delete-row-after-action=\"true\"\n" +
    "            x-api-data-fn-name=\"getInviteOrganisations\"\n" +
    "            x-api-data-fn-parameters='[]'\n" +
    "            x-api-allow-data-update=\"true\"\n" +
    "            x-row-delete-enabled=\"true\"\n" +
    "            x-row-delete-button-disabled-expression=\"!p.editable\"\n" +
    "            x-row-delete-id-property=\"id\"\n" +
    "            x-row-delete-display-template=\"false\"\n" +
    "            x-column-template-2='{ translation.translate(p.hasRoles ? \"YES\" : \"NO\") }'\n" +
    "            x-translation=\"translationInvite\"\n" +
    "            >\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tsAttention--Panic tsMarginBottom\" ng-if=\"saveError\">\n" +
    "        <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "            <p class=\"tscInline--Middle\">\n" +
    "                <i class=\"tsIcon-Panic tscInline-Element\"></i>\n" +
    "                <span>{{ saveError }}</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tsAttention--Info tsMarginBottom\" ng-if=\"saveSuccess\">\n" +
    "        <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "            <p class=\"tscInline--Middle\">\n" +
    "                <i class=\"tsIcon-Information tscInline-Element\"></i>\n" +
    "                <span ts-redirect data-url=\"{{ saveRedirect }}\" data-timeout=\"5\" ng-bind-html=\"$eval(texts.redirectExpr)\"></span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tsWrapInner center tsMarginBottom\">\n" +
    "        <button type=\"submit\" class=\"tsBtn--Normal--Regular\" ng-click=\"save()\" ng-disabled=\"saveSuccess\">{{ translationInvite.translate(\"SAVE\") }}</button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageUserHomeTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageUserHomeTemplate.html",
    "<div ng-if=\"errorMessage\" class=\"tsAttention--Panic\" ts-full-container=\"\">\n" +
    "    <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "        <i class=\"tsIcon-Panic\"></i>\n" +
    "        <p>\n" +
    "            <strong class=\"tsAttention-heading\">{{ translation.translate(\"ERROR_HEADLINE\") }}</strong>\n" +
    "            <span>{{errorMessage}}</span>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div ng-hide=\"closeAttention\" class=\"tsAttention--Info\">\n" +
    "    <div class=\"tsAttention-Message tsAttention-MessageClosable tsWrapInner\">\n" +
    "        <i class=\"tsIcon-Information\"></i>\n" +
    "        <p>\n" +
    "            <a class=\"tsAttention-closeMessage\" ng-click=\"closeAttention = true\"><span>{{ translation.translate(\"CLOSE\") }}</span> <i class=\"tsIcon-Close\"></i></a>\n" +
    "            <span>{{ translation.translate(\"MODIFY_ROLES\") }}</span>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"tsWrapInner\">\n" +
    "    <div class=\"tscArea tsBorderTop tsBorderBottom tsMarginTop--doubleGutter tsMarginBottom\">\n" +
    "        <div class=\"tscInlineRow\">\n" +
    "            <div>\n" +
    "                <i class=\"tsIcon-Profile\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"tscInlineRow-main\">\n" +
    "                <h4 class=\"h4 normal grey\">{{ translation.translate(\"PERSONAL_INFO\") }}</h4>\n" +
    "                <h1 class=\"h1\">{{ user.firstName }} {{ user.lastName }}</h1>\n" +
    "            </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"!user\" class='tscLoading--Full'>\n" +
    "        <div class='tsLoading-icon-large'></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"user\">\n" +
    "        <ul class=\"tscList\">\n" +
    "            <li class=\"tscInfoRow\">\n" +
    "                <span>{{ translation.translate(\"MOBILE\") }}</span>\n" +
    "                <span>{{ user.mobileNumber }}</span>\n" +
    "            </li>\n" +
    "            <li class=\"tscInfoRow\">\n" +
    "                <span>{{ translation.translate(\"EMAIL\") }}</span>\n" +
    "                <span>{{ user.emailAddress }}</span>\n" +
    "            </li>\n" +
    "            <li class=\"tscInfoRow\">\n" +
    "                <span>{{ translation.translate(\"LANGUAGE\") }}</span>\n" +
    "                <select ts-select=\"tseSelect--Normal--Narrow\"> <!--  TODO: Hur sparar vi detta? -->\n" +
    "                    <option>Svenska</option>\n" +
    "                    <option>English</option>\n" +
    "                </select>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"user\" class=\"tsMarginTop tsMarginBottom\">\n" +
    "        <!-- Combine roles -->\n" +
    "        <div ts-combine-roles\n" +
    "            data-header-text='ADD_ROLES_HEADLINE'\n" +
    "            data-add-text=\"ADD_ROLE\">\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- END: Combine roles -->\n" +
    "    </div>\n" +
    "    \n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"tsMarginTop tsPullLeft col-md-12\">\n" +
    "            <!-- Access List -->\n" +
    "            <h2 class=\"h2\">{{ translation.translate(\"PORTAL_ACCESS\") }}</h2>\n" +
    "            <div ts-access-list=\"\" data-read-only=\"true\" data-full-access-text='FULL_ACCESS' data-partial-access-text='PARTIAL_ACCESS' data-no-access-text='NO_ACCESS'>\n" +
    "            </div>\n" +
    "            <!-- END: Access List -->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tscButtonContainer--Full tsBorderTop tsPaddingTop--doubleGutter tsMarginTop\">\n" +
    "        <button class=\"tsBtn--Normal--Regular\" ng-click=\"next()\" ng-disabled=\"!puiIsSelected\">{{ translation.translate(\"NEXT\") }}</button>\n" +
    "        <p class=\"tsMarginTop--halfGutter center\"><a href ng-click=\"abort()\"><strong>{{ translation.translate(\"CANCEL\") }}</strong></a></p>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageUserSummaryTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/manageUserSummaryTemplate.html",
    "<div>\n" +
    "    <div class=\"tsBodyText tsWrapInner\">\n" +
    "        <h1 class=\"h1\">{{ translation.translate(\"CONFIRM_HEADLINE\") }}</h1>\n" +
    "        <p class=\"tsIntroText\">{{ translation.translate(\"CONFIRM_INGRESS\") }}</p>\n" +
    "    </div>\n" +
    "    <div class=\"tscArea--Large--NearWhitetsMarginTop\">\n" +
    "        <div class=\"tsWrapInner\">\n" +
    "            <div class=\"tscArea--White--Full--Border tsMarginTop tsMarginBottom\">\n" +
    "                <div class=\"tscArea tsBorderTop tsBorderBottom tsMarginTop\">\n" +
    "                    <div class=\"tscInlineRow\">\n" +
    "                        <div>\n" +
    "                            <i class=\"tsIcon-Profile\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"tscInlineRow-main\">\n" +
    "                            <h4 class=\"h4 normal grey\">{{ translation.translate(\"PERSONAL_INFO\") }}</h4>\n" +
    "                            <h1 class=\"h1\">{{ user.firstName }} {{ user.lastName }}</h1>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div >\n" +
    "                            <button class=\"tsBtn--Normal--Regular\" ng-click=\"save()\">{{ translation.translate(\"SAVE\") }}</button>\n" +
    "                            <p class=\"tsMarginTop--halfGutter center\"><a ng-click=\"abort()\"><strong>{{ translation.translate(\"CANCEL\") }}</strong></a></p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"tscArea\">\n" +
    "                    <ul class=\"tscList\">\n" +
    "                        <li class=\"tscInfoRow\">\n" +
    "                            <span>{{ translation.translate(\"MOBILE\") }}</span>\n" +
    "                            <span>{{ user.mobileNumber }}</span>\n" +
    "                        </li>\n" +
    "                        <li class=\"tscInfoRow\">\n" +
    "                            <span>{{ translation.translate(\"EMAIL\") }}</span>\n" +
    "                            <span>{{ user.emailAddress }}</span>\n" +
    "                        </li>\n" +
    "                        <li class=\"tscInfoRow\">\n" +
    "                            <span>{{ translation.translate(\"LANGUAGE\") }}</span>\n" +
    "                            <span>Svenska</span>\n" +
    "                            <!-- TODO: Display selected value -->\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"tsComponent--light tsComponent--negativeMargin\">\n" +
    "                    <h2 class=\"h2\">{{ translation.translate(\"ROLES_IN_USE\") }}</h2>\n" +
    "                    <ul class=\"tscList tsMarginTop--halfGutter\">\n" +
    "                        <li class=\"tscInfoRow\" ng-repeat=\"role in currentRoles | orderBy:'roleName'\">\n" +
    "\n" +
    "                            <div class=\"tseRadioBox--CheckButton--ColorNavigation tsPullLeft readOnly semichecked noBackground\">\n" +
    "                                <input type=\"checkbox\" disabled=\"disabled\">\n" +
    "                                <label for=\"\" class=\"ng-binding\">{{ role.roleName }}</label>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"tsMarginTop\" ng-if=\"managePuiAttributes\">\n" +
    "                    <h2 class=\"h2\">{{ translation.translate(\"ATTRIBUTE_PUIS_HEADER\") }}</h2>\n" +
    "    \n" +
    "                    <div ng-if=\"!attributePuis\" class='tscLoading--Full'>\n" +
    "                        <div class='tsLoading-icon-large'></div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div ng-if=\"attributePuis\">\n" +
    "                        <ul class=\"tscList tsMarginTop\">\n" +
    "                            <li ng-repeat=\"pui in attributePuis\" class=\"tscInfoRow\">\n" +
    "                                <span>{{ pui.displayName }}</span>\n" +
    "                                <span>\n" +
    "                                    <div class=\"tseTextField--Normal--Narrow--Inline\" ng-repeat=\"attr in pui.attributes\">\n" +
    "                                        <label>{{ translationPUI.translate(\"ATTR_\" + attr.name) }}</label>\n" +
    "                                        <input type=\"text\" ng-model=\"attr.value\" ng-change=\"attr.changed = true\">\n" +
    "                                    </div>\n" +
    "                                </span>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "    \n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"tsMarginTop\">\n" +
    "                    <h2 class=\"h2\">{{ translation.translate(\"PORTAL_ACCESS\") }}</h2>\n" +
    "                    <div ts-access-list=\"\" data-read-only=\"true\" data-full-access-text='FULL_ACCESS' data-partial-access-text='PARTIAL_ACCESS' data-no-access-text='NO_ACCESS'></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tsAttention--Info tsMarginBottom\" ng-if=\"saveRedirect\">\n" +
    "        <div class=\"tsAttention-Message tsWrapInner\">\n" +
    "            <p class=\"tscInline--Middle\">\n" +
    "                <i class=\"tsIcon-Information tscInline-Element\"></i>\n" +
    "                <span ts-redirect data-url=\"{{ saveRedirect }}\" data-timeout=\"5\" ng-bind-html=\"$eval(texts.redirectExpr)\"></span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tsWrapInner\">\n" +
    "        <div class=\"tscButtonContainer--Full tsMarginTop\">\n" +
    "            <button class=\"tsBtn--Normal--Regular\" ng-click=\"save()\">{{ translation.translate(\"SAVE\") }}</button>\n" +
    "            <p class=\"tsMarginTop--halfGutter center\"><a href ng-click=\"abort()\"><strong>{{ translation.translate(\"CANCEL\") }}</strong></a></p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/organizationSearchTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/organizationSearchTemplate.html",
    "<div class=\"search menu-search tsClear\">\n" +
    "    <form class=\"search-form\">\n" +
    "        <input type=\"search\" class=\"search-field ui-autocomplete-input\" name=\"search\" placeholder=\"{{ searchPlaceholder }}\" autocomplete=\"off\" ng-model=\"organizationId\" ng-pattern=\"orgIdRegex\" ng-disabled=\"isSearching\">\n" +
    "        <i class=\"tsIcon-Search\" ts-animate-toggle=\"searchResult\"></i>\n" +
    "        <input type=\"submit\" class=\"search-submit\" value=\"Sök\" ts-animate-toggle=\"searchResult\" ng-click=\"getOrganization(organizationId)\" ng-disabled=\"isSearching\">\n" +
    "    </form>\n" +
    "    <ul class=\"tsAccordion-list tsAccordion-list--striped tsShortCuts-list tsHidden\" ts-animate=\"searchResult\" data-animate-type=\"slide\" data-animate-duration=\"200\">\n" +
    "        <li ng-show=\"newOrganization\" class=\"tsAccordion-list-item\">\n" +
    "            <h2 class=\"h4\" ng-click=\"changeUrl(newOrganization)\">{{ newOrganization.name }}</h2>\n" +
    "        </li>\n" +
    "        <li ng-show=\"!newOrganization && isSearching\" style=\"list-style-type: none;\">\n" +
    "            <div class='tscLoading--Full--PaddingHalfGutter--BackgroundWhite'><div class='tsLoading-icon-large'></div></div>\n" +
    "        </li>\n" +
    "        <li ng-show=\"notFound\" class=\"tsAccordion-list-item\">\n" +
    "            <h2 class=\"h4\">{{ texts.noResult }}</h2> \n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/savedOrganizationsTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/savedOrganizationsTemplate.html",
    "<div class=\"tsShortCuts\">\n" +
    "    <div class=\"tsShortCuts-container\">\n" +
    "        <h2 class=\"h2 inline inverted\">{{ texts.header }}</h2>\n" +
    "        <div class='tscLoading--Full' ng-show=\"!savedOrganizations\"><div class='tsLoading-icon-large--White'></div></div>\n" +
    "        <a ng-hide=\"!savedOrganizations\" class=\"tsShortCuts-manage tsToggleDropdown\" ts-animate-toggle=\"manageOrganizations\"><span ng-show=\"!manageOrganizations\">{{ texts.manage }}</span><span ng-show=\"manageOrganizations\">{{ texts.close }}</span><i class=\"tsIcon-Configure\"></i></a>\n" +
    "        <ul class=\"tsShortCuts-links\">\n" +
    "            <li ng-repeat=\"organization in savedOrganizations\">\n" +
    "                <a class=\"tsBookmark-item\" ng-click=\"goOrganizationUrl(organization.organizationTscid, manageOrganizations)\">{{ organization.name }}<i ng-show=\"manageOrganizations\" class=\"tsIcon-Delete tsHandleShortCut-icon\" ng-click=\"removeOrganization(organization)\"></i></a>\n" +
    "            </li>\n" +
    "            <li id=\"toggle-add\" class=\"tsShortCuts-add-link pin\" ts-animate-toggle=\"search\" ng-show=\"manageOrganizations\">\n" +
    "                <span>{{ texts.add }}<i class=\"tsIcon-Add\"></i></span>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <div class=\"tsShortCuts-arrow-up tsShortCuts-hide\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"tsShortCuts-add-url tsHidden\" ts-animate=\"search && manageOrganizations\" data-animate-type=\"slide\" data-animate-duration=\"200\">\n" +
    "        <div class=\"search header-search\" style=\"display: block;\">\n" +
    "            <div class=\"search-inner\">\n" +
    "                <form class=\"search-form\">\n" +
    "                    <span role=\"status\" aria-live=\"polite\" class=\"ui-helper-hidden-accessible\"></span><input type=\"search\" class=\"search-field ui-autocomplete-input\" name=\"search\" placeholder=\"Sök på organistionsnummer (Exempel: 212000-1355)\" autocomplete=\"off\" ng-model=\"organiziationId\" ng-pattern=\"orgIdRegex\" ng-disabled=\"isSearching\" ts-trigger-focus=\"search && manageOrganizations\">\n" +
    "                    <i class=\"tsIcon-Search\" ts-animate-toggle=\"searchResult\"></i>\n" +
    "                    <input type=\"submit\" class=\"search-submit\" value=\"Sök\" ts-animate-toggle=\"searchResult\" ng-click=\"getOrganization(organisiationId)\" ng-disabled=\"isSearching\">\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <ul class=\"tsAccordion-list tsAccordion-list--striped tsShortCuts-list tsHidden\" ts-animate=\"searchResult && search && manageOrganizations\" data-animate-type=\"slide\" data-animate-duration=\"200\">\n" +
    "        <li ng-show=\"newOrganization\" class=\"tsAccordion-list-item\" ng-click=\"toggleOrganization(newOrganization, newOrganization.$selected)\">\n" +
    "            <h2 class=\"h4\">{{ newOrganization.name }}</h2><i ng-show=\"!newOrganization.$selected\" class=\"tsIcon-Add tsShortCuts-add-btn\"></i><i ng-show=\"newOrganization.$selected\" class=\"tsIcon-Delete tsShortCuts-add-btn\"></i>\n" +
    "        </li>\n" +
    "        <li ng-show=\"!newOrganization && isSearching\" style=\"list-style-type: none;\">\n" +
    "            <div class='tscLoading--Full--PaddingHalfGutter--BackgroundWhite'><div class='tsLoading-icon-large'></div></div>\n" +
    "        </li>\n" +
    "        <li ng-show=\"notFound\" class=\"tsAccordion-list-item\">\n" +
    "            <h2 class=\"h4\">{{ texts.noResult }}</h2> \n" +
    "        </li>\n" +
    "    </ul>\n" +
    "        \n" +
    "</div>\n" +
    "");
}]);

angular.module("/resources/templating-kit/themes/mybusiness/js/angularApplications/summaryTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/resources/templating-kit/themes/mybusiness/js/angularApplications/summaryTemplate.html",
    "<div>\n" +
    "    <div ng-if=\"loading\" class=\"tscLoading--Full\">\n" +
    "        <div class=\"tsLoading-icon-large tsMarginTop--doubleGutter\"></div>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!loading\">\n" +
    "        <h2 class=\"h2\">{{ translation.translate(\"HEADLINE\") }}</h2>\n" +
    "        <ul class=\"tsNotifications\">\n" +
    "            <li ng-show=\"pendingRequestsLength  > 0\">\n" +
    "                <i class=\"tsIcon-Profile\"></i>\n" +
    "                <p><a href=\"{{ pendingRequestsUrl }}\">{{ pendingRequestsLength  }} {{ translation.translate(\"NEW_USERS\") }}</a> {{ translation.translate(\"AWAITING_VERIFICATION\") }}</p>\n" +
    "            </li>\n" +
    "            <li ng-show=\"ordersAssignedToMeLength > 0\">\n" +
    "                <i class=\"tsIcon-Cart\"></i>\n" +
    "                <p><a href=\"{{ ordersAssignedToMeUrl }}\">{{ ordersAssignedToMeLength }} {{ translation.translate(\"ORDERS_SHARED\") }}</a></p>\n" +
    "            </li>\n" +
    "            <li ng-show=\"savedOrdersLength > 0\">\n" +
    "                <i class=\"tsIcon-Time\"></i>\n" +
    "                <p><a href=\"{{ savedOrderUrl }}\">{{ savedOrdersLength }} {{ translation.translate(\"ORDERS_PAUSED\") }}</a></p>\n" +
    "            </li>\n" +
    "            <li ng-hide=\"(pendingRequestsLength  > 0) || (ordersAssignedToMeLength > 0) || (savedOrdersLength > 0)\">\n" +
    "                {{ translation.translate(\"NO_NOTIFICATIONS\") }}\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
});

